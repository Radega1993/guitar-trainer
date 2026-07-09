import { StageBlock } from '../../types';
import {
  compareLevel,
  examLevel,
  miniStudyLevel,
  mixLevel,
  repasoLevel,
  scrollingLevel,
  speedLevel,
} from '../levelFactory';
import { theoryBlock03 } from '../theory';

const blockId = 'stage1-block3';

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

const all = [...s1, ...s2];

let order = 1;
let prev: string | undefined;

const l1 = repasoLevel(blockId, order++, 'Repaso primera cuerda', [...s1], prev);
prev = l1.id;
const l2 = repasoLevel(blockId, order++, 'Repaso segunda cuerda', [...s2], prev);
prev = l2.id;
const l3 = compareLevel(blockId, order++, 'Diferencia Mi y Si', [s1[0], s2[0]], prev);
prev = l3.id;
const l4 = compareLevel(blockId, order++, 'Diferencia Fa y Do', [s1[1], s2[1]], prev);
prev = l4.id;
const l5 = compareLevel(blockId, order++, 'Diferencia Sol y Re', [s1[2], s2[2]], prev);
prev = l5.id;
const l6 = mixLevel(blockId, order++, 'Mezcla 4 notas', all.slice(0, 4), 12, prev);
prev = l6.id;
const l7 = mixLevel(blockId, order++, 'Mezcla 6 notas', all, 14, prev);
prev = l7.id;
const l8 = scrollingLevel(blockId, order++, 'Lectura animada lenta', all, 'slow', 12, prev);
prev = l8.id;
const l9 = scrollingLevel(blockId, order++, 'Lectura animada normal', all, 'normal', 12, prev);
prev = l9.id;
const l10 = speedLevel(blockId, order++, 'Velocidad', all, 12, prev);
prev = l10.id;
const l11 = miniStudyLevel(blockId, order++, 'Mini estudio dos cuerdas', all, 14, prev);
prev = l11.id;
const l12 = examLevel(blockId, order++, 'Examen dos cuerdas', all, 14, prev);

export const block03Strings12: StageBlock = {
  id: blockId,
  title: 'Primera + segunda cuerda',
  description: 'Mezcla las notas de las dos primeras cuerdas.',
  order: 3,
  theory: theoryBlock03,
  requiresExamToUnlockNext: true,
  levels: [l1, l2, l3, l4, l5, l6, l7, l8, l9, l10, l11, l12],
  examLevelId: l12.id,
};
