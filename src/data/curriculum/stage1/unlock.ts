import { ProgressState } from '../../../storage/types';
import { STAGE1_ALL_POSITIONS } from './positions';
import { stage1 } from './stage1';

/** Notes unlocked for practice based on completed blocks/exams. */
export function getUnlockedStage1Notes(state: ProgressState): string[] {
  const unlocked = new Set<string>();

  for (const block of stage1.blocks) {
    const blockProgress = state.blocks[block.id];
    const isBlock0 = block.order === 0;

    if (isBlock0) {
      const allDone = block.levels.every(
        (level) => (state.studyLevels[level.id]?.completed ?? false) || (state.studyLevels[level.id]?.bestStars ?? 0) >= 1
      );
      if (!allDone) continue;
    } else if (!blockProgress?.examPassed) {
      continue;
    }

    for (const level of block.levels) {
      for (const note of level.config.notes) {
        if (note) unlocked.add(note);
      }
    }
  }

  if (unlocked.size === 0) {
    return STAGE1_ALL_POSITIONS.slice(0, 3).map((p) => p.noteLabel);
  }

  return Array.from(unlocked);
}

export function isStage1BlockUnlocked(blockId: string, state: ProgressState): boolean {
  const block = stage1.blocks.find((b) => b.id === blockId);
  if (!block) return false;
  if (block.order === 0) return true;

  const prev = stage1.blocks.find((b) => b.order === block.order - 1);
  if (!prev) return true;

  const prevProgress = state.blocks[prev.id];
  if (prev.order === 0) {
    if (state.blocks[prev.id]?.completed) return true;
    return prev.levels.every(
      (level) =>
        (state.studyLevels[level.id]?.completed ?? false) ||
        (state.studyLevels[level.id]?.bestStars ?? 0) >= 1
    );
  }

  return prevProgress?.examPassed === true;
}

export function isStage1FinalExamUnlocked(state: ProgressState): boolean {
  const examBlocks = stage1.blocks.filter((b) => b.order >= 1 && b.order <= 8);
  return examBlocks.every((b) => state.blocks[b.id]?.examPassed === true);
}
