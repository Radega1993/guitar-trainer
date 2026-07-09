import { buildTips } from '../tipsEngine';

describe('tipsEngine', () => {
  it('returns default tip when there is no strong signal', () => {
    const tips = buildTips({
      kpis: {
        levelsCompleted: 0,
        totalStars: 0,
        accuracyPct: 0,
        avgResponseSeconds: 0,
        totalAttempts: 0,
      },
      worstNotes: [],
      worstStrings: [],
      trend: [],
    });

    expect(tips).toHaveLength(1);
    expect(tips[0].id).toBe('default');
  });

  it('creates note and string tips for high error rates', () => {
    const tips = buildTips({
      kpis: {
        levelsCompleted: 2,
        totalStars: 6,
        accuracyPct: 72,
        avgResponseSeconds: 2.8,
        totalAttempts: 50,
      },
      worstNotes: [{ note: 'F4', wrongCount: 8, attempts: 12, errorRatePct: 66 }],
      worstStrings: [{ string: 5, wrongCount: 10, attempts: 20, errorRatePct: 50 }],
      trend: [],
    });

    const ids = tips.map((t) => t.id);
    expect(ids).toContain('note-F4');
    expect(ids).toContain('string-5');
  });

  it('adds fluency tip when accurate but slow', () => {
    const tips = buildTips({
      kpis: {
        levelsCompleted: 3,
        totalStars: 8,
        accuracyPct: 82,
        avgResponseSeconds: 4.1,
        totalAttempts: 100,
      },
      worstNotes: [],
      worstStrings: [],
      trend: [],
    });

    expect(tips.some((t) => t.id === 'fluency')).toBe(true);
  });
});
