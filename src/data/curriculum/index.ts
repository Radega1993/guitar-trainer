import { INITIAL_STUDY_BLOCKS } from './blocks.initial';
import { StudyBlock, StudyLevel } from './types';

export { INITIAL_STUDY_BLOCKS };
export type {
  BlockExam,
  ExerciseConfig,
  ExerciseType,
  MiniStudy,
  PassCriteria,
  StarCriteria,
  StudyBlock,
  StudyLevel,
  TheoryLesson,
} from './types';

export const CURRICULUM_VERSION = 'mvp-v1';

export function getStudyBlockById(blockId: string, blocks: StudyBlock[] = INITIAL_STUDY_BLOCKS) {
  return blocks.find((block) => block.id === blockId);
}

export function getStudyLevelById(levelId: string, blocks: StudyBlock[] = INITIAL_STUDY_BLOCKS): StudyLevel | undefined {
  for (const block of blocks) {
    const level = block.levels.find((v) => v.id === levelId);
    if (level) return level;
  }
  return undefined;
}

export function flattenStudyLevels(blocks: StudyBlock[] = INITIAL_STUDY_BLOCKS): StudyLevel[] {
  return blocks.flatMap((block) => block.levels);
}

