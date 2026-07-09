import { CURRICULUM_ROADMAP, RoadmapStage, StageAvailability } from './roadmap';
import { stage1 } from './stage1/stage1';
import { ProgressState } from '../../storage/types';

export interface StageProgressSummary {
  stageId: string;
  completedBlocks: number;
  totalBlocks: number;
  isComplete: boolean;
  availability: StageAvailability;
}

function isBlock1Complete(state: ProgressState): boolean {
  const finalBlock = stage1.blocks.find((b) => b.id === 'stage1-block9');
  return state.blocks['stage1-block9']?.examPassed === true;
}

function isRoadmapBlockComplete(curriculumBlockId: string, state: ProgressState): boolean {
  if (curriculumBlockId === 'stage1-block0') {
    return state.blocks['stage1-block0']?.completed === true;
  }
  return state.blocks[curriculumBlockId]?.examPassed === true;
}

export function getStage1Progress(state: ProgressState): StageProgressSummary {
  const stage = CURRICULUM_ROADMAP[0];
  const completed = stage.blocks.filter(
    (b) => b.curriculumBlockId && isRoadmapBlockComplete(b.curriculumBlockId, state)
  ).length;
  return {
    stageId: 'stage-1',
    completedBlocks: completed,
    totalBlocks: stage.blocks.length,
    isComplete: isBlock1Complete(state),
    availability: 'active',
  };
}

function isStageComplete(stageId: string, state: ProgressState): boolean {
  if (stageId === 'stage-1') return isBlock1Complete(state);
  return false;
}

export function getStageAvailability(stage: RoadmapStage, state: ProgressState): StageAvailability {
  if (stage.availability === 'post_mvp') return 'post_mvp';
  if (stage.id === 'stage-1') return 'active';

  const prevStage = CURRICULUM_ROADMAP.find((s) => s.order === stage.order - 1);
  if (!prevStage) return stage.availability;

  if (!isStageComplete(prevStage.id, state)) {
    return 'locked';
  }

  return stage.availability;
}

export function getStageStatusLabel(stage: RoadmapStage, state: ProgressState): string {
  const availability = getStageAvailability(stage, state);

  if (availability === 'active') {
    const progress = getStage1Progress(state);
    if (progress.isComplete) return 'Completada';
    if (progress.completedBlocks > 0) {
      return `${progress.completedBlocks} de ${progress.totalBlocks} completados`;
    }
    return 'En progreso';
  }

  if (availability === 'coming_soon') {
    return 'Próximamente';
  }

  if (availability === 'post_mvp') {
    return 'Post-MVP · Próximamente';
  }

  return 'Se desbloquea al completar la etapa anterior';
}

export function isRoadmapBlockUnlocked(
  curriculumBlockId: string,
  state: ProgressState,
  isStudyBlockUnlocked: (id: string) => boolean
): boolean {
  return isStudyBlockUnlocked(curriculumBlockId);
}

export function isRoadmapBlockDone(curriculumBlockId: string, state: ProgressState): boolean {
  return isRoadmapBlockComplete(curriculumBlockId, state);
}
