import { CURRICULUM_ROADMAP } from './roadmap';
import { isRoadmapBlockDone } from './roadmapProgress';
import { ProgressState } from '../../storage/types';
import { getStudyLevelById, STAGE1_BLOCKS } from './index';
import { StageExerciseType } from './types';
import {
  isStudyLevelComplete,
  isStudyLevelUnlocked,
} from './pathNavigation';

export type PathNodeState = 'locked' | 'available' | 'current' | 'completed' | 'perfect';

export interface PathLessonNode {
  id: string;
  studyLevelId: string;
  title: string;
  levelType?: StageExerciseType;
  state: PathNodeState;
  stars: 0 | 1 | 2 | 3;
  isBoss: boolean;
  side: 'left' | 'right';
}

export interface PathModuleSection {
  id: string;
  blockIndex: number;
  moduleTitle: string;
  curriculumBlockId: string;
  blockLocked: boolean;
  blockComplete: boolean;
  completedLessons: number;
  totalLessons: number;
  lessons: PathLessonNode[];
}

/** @deprecated Use PathModuleSection */
export interface PathNode {
  id: string;
  stageId: string;
  moduleTitle: string;
  curriculumBlockId: string;
  state: PathNodeState;
  stars: 0 | 1 | 2 | 3;
  progressInModule: number;
  isBoss: boolean;
  side: 'left' | 'right';
}

export interface FutureStagePreview {
  id: string;
  title: string;
  emoji: string;
  locked: boolean;
  label: string;
}

function lessonStars(studyLevelId: string, state: ProgressState): 0 | 1 | 2 | 3 {
  const stars = state.studyLevels[studyLevelId]?.bestStars ?? 0;
  if (stars >= 3) return 3;
  if (stars >= 2) return 2;
  if (stars >= 1) return 1;
  return 0;
}

function lessonState(
  studyLevelId: string,
  state: ProgressState,
  blockLocked: boolean
): PathNodeState {
  if (blockLocked) return 'locked';
  const level = getStudyLevelById(studyLevelId);
  if (!level || !isStudyLevelUnlocked(level, state)) return 'locked';

  const stars = lessonStars(studyLevelId, state);
  const done = isStudyLevelComplete(studyLevelId, state);
  if (done && stars >= 3) return 'perfect';
  if (done) return 'completed';
  return 'available';
}

export function buildLearningPathSections(
  state: ProgressState,
  isStudyBlockUnlocked: (id: string) => boolean
): PathModuleSection[] {
  const stage = CURRICULUM_ROADMAP[0];
  const sections: PathModuleSection[] = stage.blocks
    .filter((b) => b.curriculumBlockId)
    .map((roadmapBlock, blockIndex) => {
      const curriculumBlockId = roadmapBlock.curriculumBlockId!;
      const studyBlock = STAGE1_BLOCKS.find((b) => b.id === curriculumBlockId);
      const blockLocked = !isStudyBlockUnlocked(curriculumBlockId);
      const blockComplete = isRoadmapBlockDone(curriculumBlockId, state);

      const lessons: PathLessonNode[] = (studyBlock?.levels ?? []).map((level, lessonIndex) => ({
        id: level.id,
        studyLevelId: level.id,
        title: level.title,
        levelType: level.stageLevelType,
        state: lessonState(level.id, state, blockLocked),
        stars: lessonStars(level.id, state),
        isBoss: level.stageLevelType === 'exam',
        side: lessonIndex % 2 === 0 ? 'left' : 'right',
      }));

      const completedLessons = lessons.filter(
        (l) => l.state === 'completed' || l.state === 'perfect'
      ).length;

      return {
        id: roadmapBlock.id,
        blockIndex,
        moduleTitle: studyBlock?.title ?? roadmapBlock.title,
        curriculumBlockId,
        blockLocked,
        blockComplete,
        completedLessons,
        totalLessons: lessons.length,
        lessons,
      };
    });

  let currentMarked = false;
  for (const section of sections) {
    for (const lesson of section.lessons) {
      if (currentMarked || lesson.state === 'locked') continue;
      if (lesson.state === 'available') {
        lesson.state = 'current';
        currentMarked = true;
      }
    }
  }

  return sections;
}

export function getCurrentLessonNode(
  state: ProgressState,
  isStudyBlockUnlocked: (id: string) => boolean
): PathLessonNode | undefined {
  for (const section of buildLearningPathSections(state, isStudyBlockUnlocked)) {
    const current = section.lessons.find((l) => l.state === 'current');
    if (current) return current;
  }
  return undefined;
}

export function getActiveBlockIndex(
  sections: PathModuleSection[],
  state: ProgressState,
  isStudyBlockUnlocked: (id: string) => boolean
): number {
  const current = getCurrentLessonNode(state, isStudyBlockUnlocked);
  if (current) {
    const idx = sections.findIndex((s) => s.lessons.some((l) => l.id === current.id));
    if (idx >= 0) return idx;
  }

  const firstOpen = sections.findIndex((s) => !s.blockLocked && !s.blockComplete);
  if (firstOpen >= 0) return firstOpen;

  const lastUnlocked = [...sections].reverse().findIndex((s) => !s.blockLocked);
  if (lastUnlocked >= 0) return sections.length - 1 - lastUnlocked;

  return 0;
}

export function flattenLessons(sections: PathModuleSection[]): PathLessonNode[] {
  return sections.flatMap((s) => s.lessons);
}

/** @deprecated Use buildLearningPathSections */
export function buildLearningPath(
  state: ProgressState,
  isStudyBlockUnlocked: (id: string) => boolean
): PathNode[] {
  return buildLearningPathSections(state, isStudyBlockUnlocked).map((section) => {
    const progress =
      section.totalLessons > 0 ? section.completedLessons / section.totalLessons : 0;
    const stars = section.lessons.reduce<0 | 1 | 2 | 3>(
      (max, l) => (l.stars > max ? l.stars : max),
      0
    );
    let nodeState: PathNodeState = 'locked';
    if (section.blockLocked) nodeState = 'locked';
    else if (section.blockComplete && stars >= 3) nodeState = 'perfect';
    else if (section.blockComplete) nodeState = 'completed';
    else nodeState = 'available';

    const hasCurrent = section.lessons.some((l) => l.state === 'current');
    if (hasCurrent) nodeState = 'current';

    return {
      id: section.id,
      stageId: 'stage-1',
      moduleTitle: section.moduleTitle,
      curriculumBlockId: section.curriculumBlockId,
      state: nodeState,
      stars,
      progressInModule: progress,
      isBoss: section.lessons.some((l) => l.isBoss),
      side: section.blockIndex % 2 === 0 ? 'left' : 'right',
    };
  });
}

/** @deprecated Use getCurrentLessonNode */
export function getCurrentPathNode(
  state: ProgressState,
  isStudyBlockUnlocked: (id: string) => boolean
): PathNode | undefined {
  return buildLearningPath(state, isStudyBlockUnlocked).find((n) => n.state === 'current');
}

export function buildFutureStagePreviews(state: ProgressState): FutureStagePreview[] {
  return CURRICULUM_ROADMAP.slice(1).map((stage) => {
    const stage1Done = state.blocks['stage1-block9']?.examPassed === true;
    const locked = stage.order > 2 || (stage.order === 2 && !stage1Done);
    return {
      id: stage.id,
      title: stage.title,
      emoji: stage.emoji,
      locked: stage.availability !== 'post_mvp' ? locked : true,
      label:
        stage.availability === 'post_mvp'
          ? 'Post-MVP · Próximamente'
          : stage.order === 2 && stage1Done
          ? 'Próximamente'
          : 'Se desbloquea al completar la etapa anterior',
    };
  });
}

export function getTotalStarsInStage(state: ProgressState): number {
  return Object.values(state.blocks).reduce((sum, b) => sum + (b?.bestStars ?? 0), 0);
}
