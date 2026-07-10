import { getStudyBlockById, getStudyLevelById, STAGE1_BLOCKS } from './index';
import { isStage1BlockUnlocked } from './stage1/unlock';
import { StudyLevel } from './types';
import { ProgressState } from '../../storage/types';

export type LessonScreen = 'TheoryLesson' | 'Quiz' | 'Recognition' | 'Exercise';

export interface LessonDestination {
  screen: LessonScreen;
  params: {
    studyLevelId: string;
    sessionMode?: 'level' | 'block';
    sourceId?: string;
    exerciseConfigId?: string;
  };
  levelTitle: string;
  moduleTitle: string;
  isExam?: boolean;
}

function isLevelComplete(levelId: string, state: ProgressState): boolean {
  const prog = state.studyLevels[levelId];
  return (prog?.completed ?? false) || (prog?.bestStars ?? 0) >= 1;
}

export function isStudyLevelComplete(levelId: string, state: ProgressState): boolean {
  return isLevelComplete(levelId, state);
}

function isLevelUnlocked(level: StudyLevel, state: ProgressState): boolean {
  if (!isStage1BlockUnlocked(level.blockId, state)) return false;
  const prev = level.unlockRequirements.previousLevelId;
  if (!prev) return true;
  return isLevelComplete(prev, state);
}

export function isStudyLevelUnlocked(level: StudyLevel, state: ProgressState): boolean {
  return isLevelUnlocked(level, state);
}

function destinationForLevel(level: StudyLevel, blockTitle: string): LessonDestination {
  const base = {
    levelTitle: level.title,
    moduleTitle: blockTitle,
    isExam: level.stageLevelType === 'exam',
  };

  if (level.stageLevelType === 'theory') {
    return { screen: 'TheoryLesson', params: { studyLevelId: level.id }, ...base };
  }
  if (level.stageLevelType === 'quiz') {
    return { screen: 'Quiz', params: { studyLevelId: level.id }, ...base };
  }
  if (level.stageLevelType === 'recognition') {
    return { screen: 'Recognition', params: { studyLevelId: level.id }, ...base };
  }
  return {
    screen: 'Exercise',
    params: {
      studyLevelId: level.id,
      sessionMode: 'level',
      sourceId: level.id,
      exerciseConfigId: level.exerciseConfigs[0]?.id,
    },
    ...base,
  };
}

export function resolveNextLesson(
  curriculumBlockId: string,
  state: ProgressState
): LessonDestination | null {
  const block = getStudyBlockById(curriculumBlockId);
  if (!block) return null;
  if (!isStage1BlockUnlocked(curriculumBlockId, state)) return null;

  for (const level of block.levels) {
    if (!isLevelUnlocked(level, state)) continue;
    if (!isLevelComplete(level.id, state)) {
      return destinationForLevel(level, block.title);
    }
  }

  if (block.blockExam) {
    const examLevel = block.levels.find((l) => l.stageLevelType === 'exam');
    if (examLevel) {
      return {
        ...destinationForLevel(examLevel, block.title),
        isExam: true,
      };
    }
  }

  return null;
}

export function getBlockIdForStudyLevel(levelId: string): string | undefined {
  const block = STAGE1_BLOCKS.find((b) => b.levels.some((l) => l.id === levelId));
  return block?.id;
}

export function resolveNextLessonAfterCompleting(
  completedLevelId: string,
  state: ProgressState
): LessonDestination | null {
  const blockId = getBlockIdForStudyLevel(completedLevelId);
  if (!blockId) return null;

  const existing = state.studyLevels[completedLevelId];
  const simulated: ProgressState = {
    ...state,
    studyLevels: {
      ...state.studyLevels,
      [completedLevelId]: {
        bestStars: Math.max(existing?.bestStars ?? 0, 1),
        bestAccuracy: Math.max(existing?.bestAccuracy ?? 0, 1),
        rounds: (existing?.rounds ?? 0) + 1,
        completed: true,
      },
    },
  };

  return resolveNextLesson(blockId, simulated);
}

export function resolveLessonForLevel(
  studyLevelId: string,
  state: ProgressState
): LessonDestination | null {
  const level = getStudyLevelById(studyLevelId);
  if (!level) return null;
  if (!isLevelUnlocked(level, state)) return null;
  const block = getStudyBlockById(level.blockId);
  if (!block) return null;
  return destinationForLevel(level, block.title);
}

export function resolveLessonForBlock(
  curriculumBlockId: string,
  state: ProgressState
): LessonDestination | null {
  const block = getStudyBlockById(curriculumBlockId);
  if (!block) return null;

  const blockDone =
    curriculumBlockId === 'stage1-block0'
      ? state.blocks[curriculumBlockId]?.completed === true
      : state.blocks[curriculumBlockId]?.examPassed === true;

  if (blockDone && block.blockExam) {
    const examLevel = block.levels.find((l) => l.stageLevelType === 'exam');
    if (examLevel) {
      return { ...destinationForLevel(examLevel, block.title), isExam: true };
    }
  }

  return resolveNextLesson(curriculumBlockId, state);
}
