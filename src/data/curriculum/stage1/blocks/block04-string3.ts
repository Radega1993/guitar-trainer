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
import { theoryBlock04 } from '../theory';

const blockId = 'stage1-block4';

const notes = [
  { label: 'G3', latin: 'Sol', string: 3, fret: 0 },
  { label: 'A3', latin: 'La', string: 3, fret: 2 },
] as const;

const g4 = { label: 'G4', latin: 'Sol agudo', string: 1, fret: 3 };

let order = 1;
let prev: string | undefined;

const levels = [];
const r1 = recognitionLevel(blockId, order++, notes[0], prev);
levels.push(r1);
prev = r1.id;
const f1 = fretboardLevel(blockId, order++, notes[0], prev);
levels.push(f1);
prev = f1.id;
const r2 = recognitionLevel(blockId, order++, notes[1], prev);
levels.push(r2);
prev = r2.id;
const f2 = fretboardLevel(blockId, order++, notes[1], prev);
levels.push(f2);
prev = f2.id;
const mix = mixLevel(blockId, order++, 'Mezcla Sol y La', [...notes], 10, prev);
levels.push(mix);
prev = mix.id;
const cmp = compareLevel(blockId, order++, 'Compara Sol grave y Sol agudo', [notes[0], g4], prev);
levels.push(cmp);
prev = cmp.id;
const scroll = scrollingLevel(blockId, order++, 'Lectura animada lenta', [...notes], 'slow', 10, prev);
levels.push(scroll);
prev = scroll.id;
const spd = speedLevel(blockId, order++, 'Velocidad', [...notes], 10, prev);
levels.push(spd);
prev = spd.id;
const mini = miniStudyLevel(blockId, order++, 'Mini estudio tercera cuerda', [...notes], 10, prev);
levels.push(mini);
prev = mini.id;
const exam = examLevel(blockId, order++, 'Examen tercera cuerda', [...notes], 12, prev);
levels.push(exam);

export const block04String3: StageBlock = {
  id: blockId,
  title: 'Tercera cuerda',
  description: 'Aprende Sol y La en la tercera cuerda.',
  order: 4,
  theory: theoryBlock04,
  requiresExamToUnlockNext: true,
  levels,
  examLevelId: exam.id,
};
