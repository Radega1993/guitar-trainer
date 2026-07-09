import { PracticeSessionState } from '../engine/practiceSession';

export interface PracticeSummary {
  durationSec: number;
  attempts: number;
  correct: number;
  accuracy: number;
  avgResponseMs: number;
  recommendation: string;
}

export function buildPracticeSummary(state: PracticeSessionState): PracticeSummary {
  const accuracy = state.stats.accuracy;
  let recommendation = 'Sigue practicando de forma regular.';
  if (accuracy >= 0.85) recommendation = 'Excelente control. Sube velocidad o amplía rango.';
  else if (accuracy >= 0.7) recommendation = 'Buen progreso. Refuerza tus notas más dudosas.';
  else recommendation = 'Baja velocidad y trabaja menos notas por sesión.';

  return {
    durationSec: Math.round(state.elapsedMs / 1000),
    attempts: state.stats.attempts,
    correct: state.stats.correct,
    accuracy,
    avgResponseMs: state.stats.avgResponseMs,
    recommendation,
  };
}

