export type StaffNoteStatus =
  | 'upcoming'
  | 'moving'
  | 'active'
  | 'answered'
  | 'correct'
  | 'wrong';

export type TrainerSpeed = 'slow' | 'normal' | 'fast';

export function speedToDurationMs(speed: TrainerSpeed): number {
  if (speed === 'slow') return 1200;
  if (speed === 'fast') return 500;
  return 800;
}

export function computeTargetOffset(initialX: number, centerX: number): number {
  return initialX - centerX;
}

export function shouldLockFretboard(isMoving: boolean, lockWhileMoving: boolean): boolean {
  return lockWhileMoving && isMoving;
}

export function canAnswer(canAnswerFlag: boolean, isMoving: boolean, lockWhileMoving: boolean): boolean {
  return canAnswerFlag && !shouldLockFretboard(isMoving, lockWhileMoving);
}

export function nextActiveIndex(current: number, total: number): number | null {
  const next = current + 1;
  return next < total ? next : null;
}
