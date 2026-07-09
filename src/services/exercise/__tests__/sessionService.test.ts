import {
  createInfiniteSession,
  createLevelSession,
  createStudyBlockSession,
} from '../sessionService';

describe('sessionService', () => {
  it('creates a level session with questions', () => {
    const session = createLevelSession('l1-string1');
    expect(session.mode).toBe('level');
    expect(session.questions.length).toBeGreaterThan(0);
  });

  it('creates a study block session combining levels', () => {
    const session = createStudyBlockSession('block-1-treble-foundations');
    expect(session.mode).toBe('block');
    expect(session.questions.length).toBeGreaterThan(8);
  });

  it('creates infinite session with configured size', () => {
    const session = createInfiniteSession({ totalQuestions: 12, maxFret: 4 });
    expect(session.mode).toBe('infinite');
    expect(session.questions.length).toBe(12);
  });
});
