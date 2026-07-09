import { StageBlock } from '../../types';
import { stringBlockLevels } from '../levelFactory';
import { theoryBlock06 } from '../theory';

const blockId = 'stage1-block6';

const notes = [
  { label: 'D3', latin: 'Re', string: 4, fret: 0 },
  { label: 'E3', latin: 'Mi', string: 4, fret: 2 },
  { label: 'F3', latin: 'Fa', string: 4, fret: 3 },
] as const;

export const block06String4: StageBlock = {
  id: blockId,
  title: 'Cuarta cuerda',
  description: 'Aprende Re, Mi y Fa en la cuarta cuerda.',
  order: 6,
  theory: theoryBlock06,
  requiresExamToUnlockNext: true,
  levels: stringBlockLevels(blockId, [...notes], 10),
  examLevelId: `${blockId}-level12`,
};
