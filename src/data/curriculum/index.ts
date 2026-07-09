import { STAGE1_BLOCKS } from './stage1';
import { StudyBlock, StudyLevel } from './types';

export { STAGE1_BLOCKS };
export { stage1, stage1ToStudyBlocks } from './stage1';
export { CURRICULUM_ROADMAP, getRoadmapStage } from './roadmap';
export type { RoadmapStage, RoadmapBlock, StageAvailability, GrowthIcon } from './roadmap';
export type {
  BlockExam,
  ExerciseConfig,
  ExerciseType,
  MiniStudy,
  PassCriteria,
  QuizQuestion,
  Stage,
  StageBlock,
  StageExerciseType,
  StageLevel,
  StageLevelConfig,
  StarCriteria,
  StudyBlock,
  StudyLevel,
  TheoryContent,
  TheoryLesson,
  TheoryPage,
} from './types';

export const CURRICULUM_VERSION = 'stage1-v1';

export function getStudyBlockById(blockId: string, blocks: StudyBlock[] = STAGE1_BLOCKS) {
  return blocks.find((block) => block.id === blockId);
}

export function getStudyLevelById(
  levelId: string,
  blocks: StudyBlock[] = STAGE1_BLOCKS
): StudyLevel | undefined {
  for (const block of blocks) {
    const level = block.levels.find((v) => v.id === levelId);
    if (level) return level;
  }
  return undefined;
}

export function flattenStudyLevels(blocks: StudyBlock[] = STAGE1_BLOCKS): StudyLevel[] {
  return blocks.flatMap((block) => block.levels);
}

/** @deprecated Use STAGE1_BLOCKS */
export const INITIAL_STUDY_BLOCKS = STAGE1_BLOCKS;
