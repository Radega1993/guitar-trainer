import {
  canAnswerInPhase,
  getReadingSpeedMs,
  nextPhaseAfterAdvance,
  nextPhaseAfterAnswer,
  nextPhaseAfterArrive,
} from '../readingPace';

describe('reading pace', () => {
  it('returns slower speeds for easier levels', () => {
    expect(getReadingSpeedMs(1)).toBe(2200);
    expect(getReadingSpeedMs(3)).toBe(2200);
    expect(getReadingSpeedMs(4)).toBe(1700);
    expect(getReadingSpeedMs(6)).toBe(1700);
    expect(getReadingSpeedMs(7)).toBe(1300);
    expect(getReadingSpeedMs(10)).toBe(1300);
  });
});

describe('reading phase transitions', () => {
  it('allows answering only when note is ready', () => {
    expect(canAnswerInPhase('approaching')).toBe(false);
    expect(canAnswerInPhase('ready')).toBe(true);
    expect(canAnswerInPhase('feedback')).toBe(false);
  });

  it('returns deterministic state transitions', () => {
    expect(nextPhaseAfterAdvance()).toBe('approaching');
    expect(nextPhaseAfterArrive()).toBe('ready');
    expect(nextPhaseAfterAnswer()).toBe('feedback');
  });
});
