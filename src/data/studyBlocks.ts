import { LEVELS } from './levels';
import { INITIAL_STUDY_BLOCKS } from './curriculum';

export interface StudyBlock {
  id: string;
  title: string;
  description: string;
  levelIds: string[];
}

export const STUDY_BLOCKS: StudyBlock[] = INITIAL_STUDY_BLOCKS.map((block) => ({
  id: block.id,
  title: block.title,
  description: block.description,
  levelIds: block.levels.flatMap((level) => level.levelRefIds),
}));

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
