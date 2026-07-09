import { StageBlock } from '../../types';
import { stringBlockLevels } from '../levelFactory';
import { theoryBlock01 } from '../theory';

const blockId = 'stage1-block1';

const notes = [
  { label: 'E4', latin: 'Mi', string: 1, fret: 0 },
  { label: 'F4', latin: 'Fa', string: 1, fret: 1 },
  { label: 'G4', latin: 'Sol', string: 1, fret: 3 },
] as const;

export const block01String1: StageBlock = {
  id: blockId,
  title: 'Primera cuerda',
  description: 'Aprende Mi, Fa y Sol en la primera cuerda.',
  order: 1,
  theory: theoryBlock01,
  requiresExamToUnlockNext: true,
  levels: stringBlockLevels(blockId, [...notes], 10),
  examLevelId: `${blockId}-level12`,
};
