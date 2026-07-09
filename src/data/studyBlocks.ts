import { LEVELS } from './levels';

export interface StudyBlock {
  id: string;
  title: string;
  description: string;
  levelIds: string[];
}

export const STUDY_BLOCKS: StudyBlock[] = [
  {
    id: 'block-open-and-first',
    title: 'Bloque 1 · Cuerdas agudas',
    description: 'Introducción a lectura en 1ª y 2ª cuerda en primera posición.',
    levelIds: ['l1-string1', 'l2-string2', 'l3-strings12'],
  },
  {
    id: 'block-treble-complete',
    title: 'Bloque 2 · Registro agudo',
    description: 'Consolida lectura de las tres cuerdas agudas.',
    levelIds: ['l4-string3', 'l5-strings123'],
  },
  {
    id: 'block-bass',
    title: 'Bloque 3 · Registro grave',
    description: 'Entrena lectura en cuerdas graves y extensión de rango.',
    levelIds: ['l6-string4', 'l7-string5', 'l8-string6', 'l9-bass'],
  },
  {
    id: 'block-mastery',
    title: 'Bloque 4 · Integración completa',
    description: 'Repaso de primera posición completa.',
    levelIds: ['l10-all'],
  },
];

export function getStudyBlock(id: string): StudyBlock | undefined {
  return STUDY_BLOCKS.find((b) => b.id === id);
}

export function resolveBlockLevels(blockId: string) {
  const block = getStudyBlock(blockId);
  if (!block) return [];
  return block.levelIds
    .map((id) => LEVELS.find((l) => l.id === id))
    .filter((v): v is NonNullable<typeof v> => Boolean(v));
}
