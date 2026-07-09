import { buildInfiniteBatch } from '../infiniteGenerator';
import { defaultPracticeConfig } from '../practiceConfig';

describe('infiniteGenerator', () => {
  it('builds non-empty batch', () => {
    const batch = buildInfiniteBatch(defaultPracticeConfig);
    expect(batch.length).toBe(defaultPracticeConfig.batchSize);
  });

  it('uses failed pool when configured', () => {
    const batch = buildInfiniteBatch(
      { ...defaultPracticeConfig, onlyFailedNotes: true },
      [{ string: 1, fret: 0 }]
    );
    expect(batch.every((q) => q.position.string === 1 && q.position.fret === 0)).toBe(true);
  });
});

