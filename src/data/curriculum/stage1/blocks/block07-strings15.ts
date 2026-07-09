import { StageBlock } from '../../types';
import {
  examLevel,
  fretboardLevel,
  miniStudyLevel,
  mixLevel,
  recognitionLevel,
  repasoLevel,
  scrollingLevel,
  speedLevel,
} from '../levelFactory';
import { theoryBlock07 } from '../theory';

const blockId = 'stage1-block7';

const s5 = [
  { label: 'A2', latin: 'La', string: 5, fret: 0 },
  { label: 'B2', latin: 'Si', string: 5, fret: 2 },
  { label: 'C3', latin: 'Do', string: 5, fret: 3 },
] as const;

const s4 = [
  { label: 'D3', latin: 'Re', string: 4, fret: 0 },
  { label: 'E3', latin: 'Mi', string: 4, fret: 2 },
  { label: 'F3', latin: 'Fa', string: 4, fret: 3 },
] as const;

const s1to3 = [
  { label: 'E4', latin: 'Mi', string: 1, fret: 0 },
  { label: 'F4', latin: 'Fa', string: 1, fret: 1 },
  { label: 'G4', latin: 'Sol', string: 1, fret: 3 },
  { label: 'B3', latin: 'Si', string: 2, fret: 0 },
  { label: 'C4', latin: 'Do', string: 2, fret: 1 },
  { label: 'D4', latin: 'Re', string: 2, fret: 3 },
  { label: 'G3', latin: 'Sol', string: 3, fret: 0 },
  { label: 'A3', latin: 'La', string: 3, fret: 2 },
] as const;

const all15 = [...s1to3, ...s4, ...s5];

let order = 1;
let prev: string | undefined;
const levels = [];

for (const note of s5) {
  const rec = recognitionLevel(blockId, order++, note, prev);
  levels.push(rec);
  prev = rec.id;
  const fret = fretboardLevel(blockId, order++, note, prev);
  levels.push(fret);
  prev = fret.id;
}

const mix5 = mixLevel(blockId, order++, 'Mezcla quinta cuerda', [...s5], 10, prev);
levels.push(mix5);
prev = mix5.id;

const rep4 = repasoLevel(blockId, order++, 'Repaso cuarta cuerda', [...s4], prev);
levels.push(rep4);
prev = rep4.id;

const mix45 = mixLevel(blockId, order++, 'Mezcla cuarta + quinta', [...s4, ...s5], 12, prev);
levels.push(mix45);
prev = mix45.id;

const mixAll = mixLevel(blockId, order++, 'Mezcla cuerdas 1 a 5', all15, 14, prev);
levels.push(mixAll);
prev = mixAll.id;

const scroll = scrollingLevel(blockId, order++, 'Lectura animada lenta', all15, 'slow', 14, prev);
levels.push(scroll);
prev = scroll.id;

const scrollN = scrollingLevel(blockId, order++, 'Lectura animada normal', all15, 'normal', 14, prev);
levels.push(scrollN);
prev = scrollN.id;

const spd = speedLevel(blockId, order++, 'Velocidad', all15, 12, prev);
levels.push(spd);
prev = spd.id;

const mini = miniStudyLevel(blockId, order++, 'Mini estudio cinco cuerdas', all15, 16, prev);
levels.push(mini);
prev = mini.id;

const exam = examLevel(blockId, order++, 'Examen cinco cuerdas', all15, 14, prev);
levels.push(exam);

export const block07Strings15: StageBlock = {
  id: blockId,
  title: 'Cinco primeras cuerdas',
  description: 'Combina cuerdas 1 a 5, incluyendo la quinta cuerda.',
  order: 7,
  theory: theoryBlock07,
  requiresExamToUnlockNext: true,
  levels,
  examLevelId: exam.id,
};
