import { buildInfinitePool, pickInfinitePositions } from '../practiceMode';

describe('practiceMode', () => {
  it('filters pool by fret and strings', () => {
    const pool = buildInfinitePool({
      maxFret: 2,
      strings: [1, 2],
      naturalOnly: true,
      totalQuestions: 10,
    });
    expect(pool.every((p) => p.fret <= 2)).toBe(true);
    expect(pool.every((p) => p.string === 1 || p.string === 2)).toBe(true);
  });

  it('returns requested number of positions', () => {
    const out = pickInfinitePositions({
      maxFret: 3,
      strings: [1, 2, 3],
      naturalOnly: true,
      totalQuestions: 9,
    });
    expect(out).toHaveLength(9);
  });
});
