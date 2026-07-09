import { StageBlock } from '../../types';
import {
  examLevel,
  miniStudyLevel,
  mixLevel,
  repasoLevel,
  scrollingLevel,
  speedLevel,
} from '../levelFactory';
import { theoryBlock05 } from '../theory';

const blockId = 'stage1-block5';

const s1 = [
  { label: 'E4', latin: 'Mi', string: 1, fret: 0 },
  { label: 'F4', latin: 'Fa', string: 1, fret: 1 },
  { label: 'G4', latin: 'Sol', string: 1, fret: 3 },
] as const;

const s2 = [
  { label: 'B3', latin: 'Si', string: 2, fret: 0 },
  { label: 'C4', latin: 'Do', string: 2, fret: 1 },
  { label: 'D4', latin: 'Re', string: 2, fret: 3 },
] as const;

const s3 = [
  { label: 'G3', latin: 'Sol', string: 3, fret: 0 },
  { label: 'A3', latin: 'La', string: 3, fret: 2 },
] as const;

const all = [...s1, ...s2, ...s3];

let order = 1;
let prev: string | undefined;

const levels = [
  repasoLevel(blockId, order++, 'Repaso cuerda 1', [...s1], prev),
];
prev = levels[levels.length - 1].id;
levels.push(repasoLevel(blockId, order++, 'Repaso cuerda 2', [...s2], prev));
prev = levels[levels.length - 1].id;
levels.push(repasoLevel(blockId, order++, 'Repaso cuerda 3', [...s3], prev));
prev = levels[levels.length - 1].id;
levels.push(mixLevel(blockId, order++, 'Mezcla G3, A3, B3', [s3[0], s3[1], s2[0]], 12, prev));
prev = levels[levels.length - 1].id;
levels.push(mixLevel(blockId, order++, 'Mezcla C4, D4, E4', [s2[1], s2[2], s1[0]], 12, prev));
prev = levels[levels.length - 1].id;
levels.push(mixLevel(blockId, order++, 'Mezcla todas', all, 14, prev));
prev = levels[levels.length - 1].id;
levels.push(scrollingLevel(blockId, order++, 'Lectura animada lenta', all, 'slow', 14, prev));
prev = levels[levels.length - 1].id;
levels.push(scrollingLevel(blockId, order++, 'Lectura animada normal', all, 'normal', 14, prev));
prev = levels[levels.length - 1].id;
levels.push(speedLevel(blockId, order++, 'Velocidad', all, 12, prev));
prev = levels[levels.length - 1].id;
levels.push(miniStudyLevel(blockId, order++, 'Mini estudio tres cuerdas', all, 16, prev));
prev = levels[levels.length - 1].id;
const exam = examLevel(blockId, order++, 'Examen tres cuerdas', all, 14, prev);
levels.push(exam);

export const block05Strings123: StageBlock = {
  id: blockId,
  title: 'Tres primeras cuerdas',
  description: 'Domina las notas naturales de cuerdas 1, 2 y 3.',
  order: 5,
  theory: theoryBlock05,
  requiresExamToUnlockNext: true,
  levels,
  examLevelId: exam.id,
};
