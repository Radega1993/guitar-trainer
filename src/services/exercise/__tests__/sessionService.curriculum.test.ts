import {
  createBlockExamSession,
  createMiniStudySession,
  createStudyLevelSession,
} from '../sessionService';

describe('sessionService curriculum', () => {
  it('creates a study level session', () => {
    const session = createStudyLevelSession('b1-l1');
    expect(session.questions.length).toBeGreaterThan(0);
    expect(session.metadata?.studyLevelId).toBe('b1-l1');
  });

  it('creates a mini study session', () => {
    const session = createMiniStudySession('ms-b1-l1');
    expect(session.questions.length).toBeGreaterThan(0);
    expect(session.metadata?.isMiniStudy).toBe(true);
  });

  it('creates a block exam session', () => {
    const session = createBlockExamSession('block-1-treble-foundations');
    expect(session.questions.length).toBeGreaterThan(0);
    expect(session.metadata?.examId).toBe('exam-b1');
  });
});

