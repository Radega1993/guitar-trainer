import { readFileSync, writeFileSync } from 'fs';
import path from 'path';

const dir = path.resolve('assets/theory');
const keys = ['guitar-parts', 'guitar-strings', 'guitar-frets', 'treble-staff', 'hand-fingers'];
const entries = keys
  .map((k) => {
    const xml = readFileSync(path.join(dir, `${k}.svg`), 'utf8');
    return `  '${k}': ${JSON.stringify(xml)},`;
  })
  .join('\n');

const out = `export const THEORY_SVG: Record<string, string> = {\n${entries}\n};\n\nexport function getTheorySvg(key: string): string | undefined {\n  return THEORY_SVG[key];\n}\n`;

writeFileSync(path.resolve('src/data/curriculum/theorySvgContent.ts'), out);
console.log('Generated theorySvgContent.ts');
