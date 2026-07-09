import {
  createBlockExamSession,
  createMiniStudySession,
  createStudyLevelSession,
} from '../sessionService';

describe('sessionService curriculum', () => {
  it('creates a study level session', () => {
    const session = createStudyLevelSession('stage1-block1-level1');
    expect(session.questions.length).toBeGreaterThan(0);
    expect(session.metadata?.studyLevelId).toBe('stage1-block1-level1');
  });

  it('creates a mini study session', () => {
    const session = createMiniStudySession('mini:stage1-block1-level11');
    expect(session.questions.length).toBeGreaterThan(0);
    expect(session.metadata?.isMiniStudy).toBe(true);
  });

  it('creates a block exam session', () => {
    const session = createBlockExamSession('stage1-block1');
    expect(session.questions.length).toBeGreaterThan(0);
    expect(session.metadata?.examId).toBe('exam-stage1-block1');
  });
});
