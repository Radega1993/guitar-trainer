import { defaultPracticeConfig, normalizePracticeConfig } from '../practiceConfig';

describe('practiceConfig', () => {
  it('provides defaults', () => {
    expect(defaultPracticeConfig.strings).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it('normalizes fret and strings range', () => {
    const next = normalizePracticeConfig({
      strings: [0, 1, 1, 8],
      fretMin: 7,
      fretMax: 3,
      batchSize: 1,
    });
    expect(next.strings).toEqual([1]);
    expect(next.fretMin).toBe(3);
    expect(next.fretMax).toBe(3);
    expect(next.batchSize).toBe(4);
  });
});

