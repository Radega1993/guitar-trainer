import { StageBlock } from '../../types';
import {
  compareLevel,
  examLevel,
  fretboardLevel,
  miniStudyLevel,
  mixLevel,
  recognitionLevel,
  scrollingLevel,
  speedLevel,
} from '../levelFactory';
import { theoryBlock08 } from '../theory';

const blockId = 'stage1-block8';

const notes = [
  { label: 'E2', latin: 'Mi', string: 6, fret: 0 },
  { label: 'F2', latin: 'Fa', string: 6, fret: 1 },
  { label: 'G2', latin: 'Sol', string: 6, fret: 3 },
] as const;

const e4 = { label: 'E4', latin: 'Mi agudo', string: 1, fret: 0 };
const g3 = { label: 'G3', latin: 'Sol grave', string: 3, fret: 0 };
const g4 = { label: 'G4', latin: 'Sol agudo', string: 1, fret: 3 };

let order = 1;
let prev: string | undefined;
const levels = [];

for (const note of notes) {
  const rec = recognitionLevel(blockId, order++, note, prev);
  levels.push(rec);
  prev = rec.id;
  const fret = fretboardLevel(blockId, order++, note, prev);
  levels.push(fret);
  prev = fret.id;
}

const mix5 = mixLevel(blockId, order++, 'Mezcla sexta cuerda', [...notes], 10, prev);
levels.push(mix5);
prev = mix5.id;

const cmpE = compareLevel(blockId, order++, 'Compara Mi grave y Mi agudo', [notes[0], e4], prev);
levels.push(cmpE);
prev = cmpE.id;

const cmpG = compareLevel(blockId, order++, 'Compara Sol en tres octavas', [notes[2], g3, g4], prev);
levels.push(cmpG);
prev = cmpG.id;

const scroll = scrollingLevel(blockId, order++, 'Lectura animada lenta', [...notes], 'slow', 10, prev);
levels.push(scroll);
prev = scroll.id;

const spd = speedLevel(blockId, order++, 'Velocidad', [...notes], 10, prev);
levels.push(spd);
prev = spd.id;

const mini = miniStudyLevel(blockId, order++, 'Mini estudio sexta cuerda', [...notes], 10, prev);
levels.push(mini);
prev = mini.id;

const exam = examLevel(blockId, order++, 'Examen sexta cuerda', [...notes], 12, prev);
levels.push(exam);

export const block08String6: StageBlock = {
  id: blockId,
  title: 'Sexta cuerda',
  description: 'Aprende Mi, Fa y Sol en la sexta cuerda.',
  order: 8,
  theory: theoryBlock08,
  requiresExamToUnlockNext: true,
  levels,
  examLevelId: exam.id,
};
