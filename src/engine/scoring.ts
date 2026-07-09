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
}

/** Error percentage in the [0, 1] range. */
export function calculateErrorRate(correct: number, total: number): number {
  if (total <= 0) return 1;
  const errors = Math.max(0, total - correct);
  return errors / total;
}

/** Stars based on strict pedagogical gates: error rate + response time. */
export function calculateStars(errorRate: number, avgResponseMs: number): number {
  if (errorRate <= 0 && avgResponseMs < 1000) return 3;
  if (errorRate <= 0.1 && avgResponseMs < 1500) return 2;
  if (errorRate <= 0.2 && avgResponseMs <= 2000) return 1;
  return 0;
}

export function isLevelPassed(errorRate: number, avgResponseMs: number): boolean {
  return errorRate <= 0.2 && avgResponseMs <= 2000;
}

export function getPedagogicalMessages(errorRate: number, avgResponseMs: number): string[] {
  const messages: string[] = [];

  if (errorRate > 0.2) {
    messages.push(
      `Cometes ${Math.round(errorRate * 100)}% de errores. Repite el nivel más despacio y prioriza precisión.`
    );
  }

  if (avgResponseMs > 2000) {
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
  avgResponseMs: number
): RoundResult {
  const accuracy = total > 0 ? correct / total : 0;
  const errorRate = calculateErrorRate(correct, total);
  const stars = calculateStars(errorRate, avgResponseMs);
  const passed = isLevelPassed(errorRate, avgResponseMs);
  return {
    correct,
    total,
    accuracy,
    errorRate,
    stars,
    timeMs,
    avgResponseMs,
    passed,
    feedbackMessages: passed ? [] : getPedagogicalMessages(errorRate, avgResponseMs),
  };
}
