import { createPracticeSessionState, reducePracticeAnswer } from '../practiceSession';

describe('practiceSession', () => {
  it('tracks live stats and failed positions', () => {
    let state = createPracticeSessionState(1000);
    state = reducePracticeAnswer(state, {
      isCorrect: false,
      responseTimeMs: 1200,
      position: { string: 2, fret: 3 },
      now: 3000,
    });
    expect(state.stats.attempts).toBe(1);
    expect(state.stats.correct).toBe(0);
    expect(state.failedPositions).toHaveLength(1);
  });
});

