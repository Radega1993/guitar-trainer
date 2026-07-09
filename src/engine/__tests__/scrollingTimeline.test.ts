import {
  canAnswer,
  computeTargetOffset,
  nextActiveIndex,
  shouldLockFretboard,
  speedToDurationMs,
} from '../scrollingTimeline';

describe('scrollingTimeline', () => {
  it('maps trainer speed to duration', () => {
    expect(speedToDurationMs('slow')).toBe(1200);
    expect(speedToDurationMs('normal')).toBe(800);
    expect(speedToDurationMs('fast')).toBe(500);
  });

  it('computes target offset to align note with center', () => {
    expect(computeTargetOffset(420, 260)).toBe(160);
    expect(computeTargetOffset(260, 260)).toBe(0);
  });

  it('locks fretboard while moving only when configured', () => {
    expect(shouldLockFretboard(true, true)).toBe(true);
    expect(shouldLockFretboard(true, false)).toBe(false);
    expect(shouldLockFretboard(false, true)).toBe(false);
  });

  it('allows answering only when answer flag is true and lock conditions pass', () => {
    expect(canAnswer(true, false, true)).toBe(true);
    expect(canAnswer(true, true, true)).toBe(false);
    expect(canAnswer(false, false, true)).toBe(false);
  });

  it('advances active index and returns null at the end', () => {
    expect(nextActiveIndex(0, 5)).toBe(1);
    expect(nextActiveIndex(3, 5)).toBe(4);
    expect(nextActiveIndex(4, 5)).toBeNull();
  });
});
