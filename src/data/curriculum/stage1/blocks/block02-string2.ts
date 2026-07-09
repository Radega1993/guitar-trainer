import { StageBlock } from '../../types';
import { stringBlockLevels } from '../levelFactory';
import { theoryBlock02 } from '../theory';

const blockId = 'stage1-block2';

const notes = [
  { label: 'B3', latin: 'Si', string: 2, fret: 0 },
  { label: 'C4', latin: 'Do', string: 2, fret: 1 },
  { label: 'D4', latin: 'Re', string: 2, fret: 3 },
] as const;

export const block02String2: StageBlock = {
  id: blockId,
  title: 'Segunda cuerda',
  description: 'Aprende Si, Do y Re en la segunda cuerda.',
  order: 2,
  theory: theoryBlock02,
  requiresExamToUnlockNext: true,
  levels: stringBlockLevels(blockId, [...notes], 10),
  examLevelId: `${blockId}-level12`,
};
