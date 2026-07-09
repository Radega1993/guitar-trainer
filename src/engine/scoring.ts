import { StarCriteria } from '../data/curriculum/types';

export type ScoringMode = 'accuracy_and_speed' | 'accuracy_only';

export interface ScoringPassRules {
  maxErrorRate: number;
  maxAvgResponseMs: number;
}

export interface ScoringOptions {
  mode?: ScoringMode;
  starThresholds?: StarCriteria[];
  passRules?: ScoringPassRules;
}

export interface RoundResult {
  correct: number;
  total: number;
  accuracy: number;
  errorRate: number;
  stars: number;
  timeMs: number;
  avgResponseMs: number;
  passed: boolean;
  feedbackMessages: string[];
  scoringMode: ScoringMode;
}

/** Error percentage in the [0, 1] range. */
export function calculateErrorRate(correct: number, total: number): number {
  if (total <= 0) return 1;
  const errors = Math.max(0, total - correct);
  return errors / total;
}

const DEFAULT_THRESHOLDS: StarCriteria[] = [
  { stars: 1, accuracyMin: 0.8, maxAvgResponseMs: 2000 },
  { stars: 2, accuracyMin: 0.9, maxAvgResponseMs: 1500 },
  { stars: 3, accuracyMin: 1, maxAvgResponseMs: 1000 },
];

const DEFAULT_PASS: ScoringPassRules = {
  maxErrorRate: 0.2,
  maxAvgResponseMs: 2000,
};

/** Stars based on strict pedagogical gates: error rate + response time. */
export function calculateStars(errorRate: number, avgResponseMs: number): number {
  if (errorRate <= 0 && avgResponseMs < 1000) return 3;
  if (errorRate <= 0.1 && avgResponseMs < 1500) return 2;
  if (errorRate <= 0.2 && avgResponseMs <= 2000) return 1;
  return 0;
}

export function calculateStarsWithThresholds(
  accuracy: number,
  avgResponseMs: number,
  thresholds: StarCriteria[],
  mode: ScoringMode
): number {
  const sorted = [...thresholds].sort((a, b) => b.stars - a.stars);
  for (const threshold of sorted) {
    if (accuracy < threshold.accuracyMin) continue;
    if (mode === 'accuracy_only' || avgResponseMs <= threshold.maxAvgResponseMs) {
      return threshold.stars;
    }
  }
  return 0;
}

export function isLevelPassed(errorRate: number, avgResponseMs: number): boolean {
  return errorRate <= 0.2 && avgResponseMs <= 2000;
}

export function isLevelPassedWithRules(
  accuracy: number,
  avgResponseMs: number,
  passRules: ScoringPassRules,
  mode: ScoringMode
): boolean {
  const minAccuracy = 1 - passRules.maxErrorRate;
  if (accuracy < minAccuracy) return false;
  if (mode === 'accuracy_only') return true;
  return avgResponseMs <= passRules.maxAvgResponseMs;
}

export function getPedagogicalMessages(
  errorRate: number,
  avgResponseMs: number,
  mode: ScoringMode = 'accuracy_and_speed'
): string[] {
  const messages: string[] = [];

  if (errorRate > 0.2) {
    messages.push(
      `Cometes ${Math.round(errorRate * 100)}% de errores. Repite el nivel más despacio y prioriza precisión.`
    );
  }

  if (mode === 'accuracy_and_speed' && avgResponseMs > 2000) {
    messages.push(
      `Tu media de respuesta es ${(avgResponseMs / 1000).toFixed(
        1
      )}s. Practica lectura por bloques cortos para ganar fluidez.`
    );
  }

  if (messages.length === 0) {
    messages.push('Buen trabajo. Mantén la constancia y busca mejorar una estrella más.');
  }

  return messages;
}

export function summarizeRound(
  correct: number,
  total: number,
  timeMs: number,
  avgResponseMs: number,
  options: ScoringOptions = {}
): RoundResult {
  const mode = options.mode ?? 'accuracy_and_speed';
  const thresholds = options.starThresholds ?? DEFAULT_THRESHOLDS;
  const passRules = options.passRules ?? DEFAULT_PASS;
  const accuracy = total > 0 ? correct / total : 0;
  const errorRate = calculateErrorRate(correct, total);

  const stars =
    mode === 'accuracy_only' || options.starThresholds
      ? calculateStarsWithThresholds(accuracy, avgResponseMs, thresholds, mode)
      : calculateStars(errorRate, avgResponseMs);

  const passed = isLevelPassedWithRules(accuracy, avgResponseMs, passRules, mode);

  return {
    correct,
    total,
    accuracy,
    errorRate,
    stars,
    timeMs,
    avgResponseMs,
    passed,
    scoringMode: mode,
    feedbackMessages: passed ? [] : getPedagogicalMessages(errorRate, avgResponseMs, mode),
  };
}
