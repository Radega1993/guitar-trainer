import { StageBlock } from '../../types';
import {
  examLevel,
  miniStudyLevel,
  mixLevel,
  repasoLevel,
  scrollingLevel,
  speedLevel,
} from '../levelFactory';
import { theoryBlock09 } from '../theory';
import { STAGE1_ALL_POSITIONS } from '../positions';

const blockId = 'stage1-block9';

const allNotes = STAGE1_ALL_POSITIONS.map((p) => ({
  label: p.noteLabel,
  latin: p.noteLabel.replace(/\d+/, ''),
  string: p.string,
  fret: p.fret,
}));

const high = allNotes.filter((n) => n.string <= 2);
const mid = allNotes.filter((n) => n.string >= 3 && n.string <= 4);
const low = allNotes.filter((n) => n.string >= 5);

let order = 1;
let prev: string | undefined;
const levels = [];

const l1 = repasoLevel(blockId, order++, 'Repaso cuerdas 1 y 2', high, prev);
levels.push(l1);
prev = l1.id;
const l2 = repasoLevel(blockId, order++, 'Repaso cuerdas 3 y 4', mid, prev);
levels.push(l2);
prev = l2.id;
const l3 = repasoLevel(blockId, order++, 'Repaso cuerdas 5 y 6', low, prev);
levels.push(l3);
prev = l3.id;
const l4 = mixLevel(blockId, order++, 'Mezcla cuerdas agudas', high, 14, prev);
levels.push(l4);
prev = l4.id;
const l5 = mixLevel(blockId, order++, 'Mezcla cuerdas graves', low, 14, prev);
levels.push(l5);
prev = l5.id;
const l6 = mixLevel(blockId, order++, 'Mezcla todas las cuerdas', allNotes, 16, prev);
levels.push(l6);
prev = l6.id;
const l7 = scrollingLevel(blockId, order++, 'Lectura animada lenta', allNotes, 'slow', 16, prev);
levels.push(l7);
prev = l7.id;
const l8 = scrollingLevel(blockId, order++, 'Lectura animada normal', allNotes, 'normal', 16, prev);
levels.push(l8);
prev = l8.id;
const l9 = scrollingLevel(blockId, order++, 'Lectura animada rápida', allNotes, 'fast', 16, prev);
levels.push(l9);
prev = l9.id;
const l10 = speedLevel(blockId, order++, 'Velocidad global', allNotes, 16, prev);
levels.push(l10);
prev = l10.id;
const l11 = miniStudyLevel(blockId, order++, 'Mini estudio I', allNotes, 16, prev);
levels.push(l11);
prev = l11.id;
const l12 = miniStudyLevel(blockId, order++, 'Mini estudio II', allNotes, 16, prev);
levels.push(l12);
prev = l12.id;
const exam = examLevel(blockId, order++, 'Examen final Etapa 1', allNotes, 30, prev);
levels.push(exam);

export const block09Full: StageBlock = {
  id: blockId,
  title: 'Primera posición completa',
  description: 'Domina todas las notas naturales en primera posición.',
  order: 9,
  theory: theoryBlock09,
  requiresExamToUnlockNext: true,
  levels,
  examLevelId: exam.id,
};
