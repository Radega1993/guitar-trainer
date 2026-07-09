import { buildUserStatsViewModel } from '../statsModel';

function isoDayOffset(offset: number): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
}

describe('statsAggregator', () => {
  it('normalizes and fills trend days', () => {
    const vm = buildUserStatsViewModel({
      kpis: {
        levelsCompleted: 2,
        totalStars: 5,
        totalCorrect: 18,
        totalAttempts: 24,
        accuracy: 0.75,
        avgResponseMs: 3200,
      },
      worstNotesRaw: [{ targetNote: 'F4', wrongCount: 5, attempts: 10, errorRate: 0.5 }],
      worstStringsRaw: [{ targetString: 2, wrongCount: 3, attempts: 8, errorRate: 0.375 }],
      dailyRaw: [{ day: isoDayOffset(-1), correct: 7, attempts: 10, accuracy: 0.7 }],
      trendDays: 7,
    });

    expect(vm.kpis.accuracyPct).toBe(75);
    expect(vm.kpis.avgResponseSeconds).toBe(3.2);
    expect(vm.hotspots.worstNotes[0].errorRatePct).toBe(50);
    expect(vm.hotspots.worstStrings[0].string).toBe(2);
    expect(vm.trend).toHaveLength(7);
  });

  it('computes trend delta from latest windows', () => {
    const vm = buildUserStatsViewModel({
      kpis: {
        levelsCompleted: 1,
        totalStars: 3,
        totalCorrect: 0,
        totalAttempts: 0,
        accuracy: 0,
        avgResponseMs: 0,
      },
      worstNotesRaw: [],
      worstStringsRaw: [],
      dailyRaw: [
        { day: isoDayOffset(-5), correct: 1, attempts: 1, accuracy: 0.2 },
        { day: isoDayOffset(-4), correct: 1, attempts: 1, accuracy: 0.3 },
        { day: isoDayOffset(-3), correct: 1, attempts: 1, accuracy: 0.4 },
        { day: isoDayOffset(-2), correct: 1, attempts: 1, accuracy: 0.6 },
        { day: isoDayOffset(-1), correct: 1, attempts: 1, accuracy: 0.7 },
        { day: isoDayOffset(0), correct: 1, attempts: 1, accuracy: 0.8 },
      ],
      trendDays: 6,
    });

    expect(vm.trendDelta7d).toBeGreaterThan(0);
  });
});
