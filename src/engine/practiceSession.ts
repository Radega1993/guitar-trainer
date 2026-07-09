import { Position } from '../domain/fretboard';

export interface PracticeLiveStats {
  attempts: number;
  correct: number;
  accuracy: number;
  avgResponseMs: number;
  streak: number;
  responsesPerMin: number;
}

export interface PracticeSessionState {
  startedAt: number;
  paused: boolean;
  elapsedMs: number;
  stats: PracticeLiveStats;
  failedPositions: Position[];
}

export function createPracticeSessionState(now = Date.now()): PracticeSessionState {
  return {
    startedAt: now,
    paused: false,
    elapsedMs: 0,
    stats: {
      attempts: 0,
      correct: 0,
      accuracy: 0,
      avgResponseMs: 0,
      streak: 0,
      responsesPerMin: 0,
    },
    failedPositions: [],
  };
}

export function reducePracticeAnswer(
  state: PracticeSessionState,
  input: { isCorrect: boolean; responseTimeMs: number; position: Position; now?: number }
): PracticeSessionState {
  const now = input.now ?? Date.now();
  const attempts = state.stats.attempts + 1;
  const correct = state.stats.correct + (input.isCorrect ? 1 : 0);
  const elapsedMs = now - state.startedAt;
  const avgResponseMs = (state.stats.avgResponseMs * state.stats.attempts + input.responseTimeMs) / attempts;
  const streak = input.isCorrect ? state.stats.streak + 1 : 0;
  const responsesPerMin = elapsedMs > 0 ? (attempts * 60000) / elapsedMs : 0;
  return {
    ...state,
    elapsedMs,
    stats: {
      attempts,
      correct,
      accuracy: attempts > 0 ? correct / attempts : 0,
      avgResponseMs,
      streak,
      responsesPerMin,
    },
    failedPositions: input.isCorrect ? state.failedPositions : [...state.failedPositions, input.position],
  };
}

