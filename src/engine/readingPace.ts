/**
 * Duration (ms) for a note to travel from right side to center.
 * Lower levels are intentionally slower to promote accurate reading.
 */
export function getReadingSpeedMs(levelOrder: number): number {
  if (levelOrder <= 3) return 2200;
  if (levelOrder <= 6) return 1700;
  return 1300;
}

export type ReadingPhase = 'approaching' | 'ready' | 'feedback';

export function canAnswerInPhase(phase: ReadingPhase): boolean {
  return phase === 'ready';
}

export function nextPhaseAfterArrive(): ReadingPhase {
  return 'ready';
}

export function nextPhaseAfterAnswer(): ReadingPhase {
  return 'feedback';
}

export function nextPhaseAfterAdvance(): ReadingPhase {
  return 'approaching';
}
