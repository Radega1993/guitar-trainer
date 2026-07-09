import type { ResponseEvent, RoundEvent } from '../eventsRepository.web';

describe('practice stats persistence contracts', () => {
  it('supports session mode metadata in round and response events', () => {
    const round: RoundEvent = {
      id: 'r1',
      levelId: 'practice-infinite',
      sessionMode: 'practice',
      sessionSource: 'setup',
      startedAt: new Date().toISOString(),
      endedAt: new Date().toISOString(),
      totalQuestions: 10,
      correctCount: 7,
      stars: 0,
      durationMs: 60000,
    };
    const response: ResponseEvent = {
      id: 'a1',
      roundId: 'r1',
      questionIndex: 0,
      levelId: 'practice-infinite',
      sessionMode: 'practice',
      sessionSource: 'setup',
      targetNote: 'E4',
      targetString: 1,
      targetFret: 0,
      selectedString: 1,
      selectedFret: 0,
      isCorrect: true,
      responseTimeMs: 1200,
      createdAt: new Date().toISOString(),
    };
    expect(round.sessionMode).toBe('practice');
    expect(response.sessionSource).toBe('setup');
  });
});

