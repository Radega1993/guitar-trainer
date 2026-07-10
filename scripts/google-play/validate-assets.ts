import { createHash } from 'node:crypto';
import { readFile, readdir, stat, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

type Spec = {
  rel: string;
  width: number;
  height: number;
  alphaAllowed: boolean;
  screen: string;
  optional?: boolean;
};

const ROOT = process.cwd();
const ASSETS = path.join(ROOT, 'play-store-assets');
const META = path.join(ASSETS, 'metadata');

const specs: Spec[] = [
  { rel: 'app-icon/app-icon-512.png', width: 512, height: 512, alphaAllowed: true, screen: 'app-icon' },
  {
    rel: 'feature-graphic/feature-graphic-1024x500.png',
    width: 1024,
    height: 500,
    alphaAllowed: false,
    screen: 'feature-graphic',
  },
  { rel: 'phone/portrait/01-home.png', width: 1080, height: 1920, alphaAllowed: false, screen: 'home' },
  { rel: 'phone/portrait/02-theory.png', width: 1080, height: 1920, alphaAllowed: false, screen: 'theory' },
  { rel: 'phone/portrait/03-staff.png', width: 1080, height: 1920, alphaAllowed: false, screen: 'staff' },
  { rel: 'phone/portrait/04-fretboard.png', width: 1080, height: 1920, alphaAllowed: false, screen: 'fretboard' },
  { rel: 'phone/portrait/05-reading.png', width: 1080, height: 1920, alphaAllowed: false, screen: 'reading' },
  { rel: 'phone/portrait/06-feedback.png', width: 1080, height: 1920, alphaAllowed: false, screen: 'feedback' },
  { rel: 'phone/portrait/07-practice.png', width: 1080, height: 1920, alphaAllowed: false, screen: 'practice' },
  { rel: 'phone/portrait/08-progress.png', width: 1080, height: 1920, alphaAllowed: false, screen: 'progress' },
  { rel: 'tablet-7/portrait/01-home.png', width: 1440, height: 2560, alphaAllowed: false, screen: 'tablet-7-home', optional: true },
  { rel: 'tablet-7/portrait/02-theory.png', width: 1440, height: 2560, alphaAllowed: false, screen: 'tablet-7-theory', optional: true },
  { rel: 'tablet-7/portrait/03-staff.png', width: 1440, height: 2560, alphaAllowed: false, screen: 'tablet-7-staff', optional: true },
  { rel: 'tablet-7/portrait/04-fretboard.png', width: 1440, height: 2560, alphaAllowed: false, screen: 'tablet-7-fretboard', optional: true },
  { rel: 'tablet-10/portrait/01-home.png', width: 1800, height: 3200, alphaAllowed: false, screen: 'tablet-10-home', optional: true },
  { rel: 'tablet-10/portrait/02-theory.png', width: 1800, height: 3200, alphaAllowed: false, screen: 'tablet-10-theory', optional: true },
  { rel: 'tablet-10/portrait/03-staff.png', width: 1800, height: 3200, alphaAllowed: false, screen: 'tablet-10-staff', optional: true },
  { rel: 'tablet-10/portrait/04-fretboard.png', width: 1800, height: 3200, alphaAllowed: false, screen: 'tablet-10-fretboard', optional: true },
];

const altText: Record<string, string> = {
  '01-home.png': 'Recorrido de aprendizaje con el primer bloque visible.',
  '02-theory.png': 'Pantalla de teoria del bloque de primera cuerda.',
  '03-staff.png': 'Ejercicio de identificacion de notas en pentagrama.',
  '04-fretboard.png': 'Mastil interactivo para seleccionar cuerda y traste.',
  '05-reading.png': 'Lectura animada de notas musicales.',
  '06-feedback.png': 'Feedback tras una respuesta del quiz.',
  '07-practice.png': 'Configuracion de practica infinita.',
  '08-progress.png': 'Resumen de estadisticas y progreso de aprendizaje.',
};

function sha256(buffer: Buffer) {
  return createHash('sha256').update(buffer).digest('hex');
}

async function validateOne(spec: Spec, errors: string[]) {
  const abs = path.join(ASSETS, spec.rel);
  try {
    const data = await readFile(abs);
    const info = await sharp(data).metadata();
    const st = await stat(abs);
    if (info.width !== spec.width || info.height !== spec.height) {
      errors.push(`${spec.rel}: expected ${spec.width}x${spec.height}, got ${info.width}x${info.height}`);
    }
    if (!spec.alphaAllowed && info.hasAlpha) {
      errors.push(`${spec.rel}: alpha channel not allowed`);
    }
    if (st.size <= 1024) {
      errors.push(`${spec.rel}: file too small (looks empty)`);
    }
    return {
      file: spec.rel,
      width: info.width,
      height: info.height,
      format: info.format,
      alpha: Boolean(info.hasAlpha),
      sha256: sha256(data),
      screen: spec.screen,
      altText: altText[path.basename(spec.rel)] ?? 'Captura de app',
    };
  } catch (err) {
    if (!spec.optional) {
      errors.push(`${spec.rel}: missing or invalid (${String(err)})`);
    }
    return null;
  }
}

async function detectDuplicates(manifest: any[], errors: string[]) {
  const byHash = new Map<string, string[]>();
  for (const item of manifest) {
    const arr = byHash.get(item.sha256) ?? [];
    arr.push(item.file);
    byHash.set(item.sha256, arr);
  }
  for (const files of byHash.values()) {
    if (files.length > 1) errors.push(`duplicate images detected: ${files.join(', ')}`);
  }
}

async function validateNames(errors: string[]) {
  const phoneDir = path.join(ASSETS, 'phone/portrait');
  try {
    const files = (await readdir(phoneDir)).filter((f) => f.endsWith('.png'));
    const expected = new Set(
      specs
        .filter((s) => s.rel.startsWith('phone/portrait'))
        .map((s) => path.basename(s.rel))
    );
    for (const f of files) {
      if (!expected.has(f)) errors.push(`unexpected phone screenshot filename: ${f}`);
    }
  } catch {
    errors.push('phone/portrait folder not found');
  }
}

async function main() {
  await mkdir(META, { recursive: true });
  const errors: string[] = [];
  const manifest = (await Promise.all(specs.map((s) => validateOne(s, errors)))).filter(Boolean);
  await detectDuplicates(manifest as any[], errors);
  await validateNames(errors);

  const manifestPath = path.join(META, 'assets-manifest.json');
  const reportPath = path.join(META, 'validation-report.md');
  const altPath = path.join(META, 'alt-text-es.json');

  await writeFile(manifestPath, JSON.stringify(manifest, null, 2));
  await writeFile(altPath, JSON.stringify(altText, null, 2));

  const report = [
    '# Asset validation report',
    '',
    `Checked: ${manifest.length} files`,
    '',
    errors.length ? '## Blocking errors' : '## Status',
    '',
    ...(errors.length ? errors.map((e) => `- ${e}`) : ['- No blocking errors.']),
  ].join('\n');
  await writeFile(reportPath, report);

  if (errors.length) {
    console.error(report);
    process.exit(1);
  }
  console.log(report);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
