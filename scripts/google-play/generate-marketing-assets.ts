import { mkdir, access } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = process.cwd();
const assetsRoot = path.join(ROOT, 'play-store-assets');
const appIconDir = path.join(assetsRoot, 'app-icon');
const featureDir = path.join(assetsRoot, 'feature-graphic');
const phoneDir = path.join(assetsRoot, 'phone/portrait');
const tablet7Dir = path.join(assetsRoot, 'tablet-7/portrait');
const tablet10Dir = path.join(assetsRoot, 'tablet-10/portrait');

const baseIcon = path.join(ROOT, 'assets/icon.png');

async function ensureDir(dir: string) {
  await mkdir(dir, { recursive: true });
}

async function ensureExists(filePath: string) {
  await access(filePath);
}

async function generateAppIcon() {
  await ensureDir(appIconDir);
  const out = path.join(appIconDir, 'app-icon-512.png');
  await sharp(baseIcon).resize(512, 512).png({ compressionLevel: 9 }).toFile(out);
}

async function generateFeatureGraphic() {
  await ensureDir(featureDir);
  const out = path.join(featureDir, 'feature-graphic-1024x500.png');
  const banner = sharp({
    create: {
      width: 1024,
      height: 500,
      channels: 3,
      background: { r: 28, g: 25, b: 23 },
    },
  });
  const icon = await sharp(baseIcon).resize(240, 240).png().toBuffer();
  await banner
    .composite([
      { input: icon, left: 70, top: 130 },
      {
        input: Buffer.from(
          `<svg width="1024" height="500" xmlns="http://www.w3.org/2000/svg">
            <text x="340" y="190" fill="#f5f0e9" font-size="54" font-family="Arial" font-weight="700">Guitar Trainer</text>
            <text x="340" y="255" fill="#f59e0b" font-size="34" font-family="Arial">Lectura musical para guitarra clasica</text>
            <text x="340" y="315" fill="#b8ada2" font-size="24" font-family="Arial">Primer bloque completo: Mi, Fa y Sol</text>
          </svg>`
        ),
        left: 0,
        top: 0,
      },
    ])
    .removeAlpha()
    .flatten({ background: { r: 28, g: 25, b: 23 } })
    .png()
    .toFile(out);
}

async function generateAndroidAppIcons() {
  await sharp(baseIcon).resize(1024, 1024).png().toFile(path.join(ROOT, 'assets/splash-icon.png'));
  await sharp(baseIcon).resize(432, 432).png().toFile(path.join(ROOT, 'assets/android-icon-foreground.png'));
  await sharp(baseIcon)
    .resize(432, 432)
    .grayscale()
    .threshold(140)
    .png()
    .toFile(path.join(ROOT, 'assets/android-icon-monochrome.png'));
}

async function mirrorPhoneToTabletIfPresent() {
  await ensureDir(tablet7Dir);
  await ensureDir(tablet10Dir);

  const samples = ['01-home.png', '02-theory.png', '03-staff.png', '04-fretboard.png'];
  for (const sample of samples) {
    const src = path.join(phoneDir, sample);
    try {
      await ensureExists(src);
      await sharp(src).resize(1440, 2560).png().toFile(path.join(tablet7Dir, sample));
      await sharp(src).resize(1800, 3200).png().toFile(path.join(tablet10Dir, sample));
    } catch {
      // Tablet assets remain pending if phone captures are unavailable.
    }
  }
}

async function main() {
  await ensureDir(assetsRoot);
  await generateAppIcon();
  await generateFeatureGraphic();
  await generateAndroidAppIcons();
  await mirrorPhoneToTabletIfPresent();
  console.log('Marketing assets generated.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
