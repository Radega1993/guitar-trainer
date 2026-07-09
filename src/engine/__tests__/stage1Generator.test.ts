import { generateStage1Exercise, stepwiseRatio } from '../stage1Generator';

describe('stage1Generator', () => {
  it('generates unique position per note', () => {
    const ex = generateStage1Exercise({
      notes: ['E4', 'F4', 'G4'],
      strings: [1],
      frets: [0, 1, 3],
      numberOfQuestions: 9,
      exerciseType: 'fretboard',
    });
    ex.questions.forEach((q) => {
      expect(q.validPositions).toHaveLength(1);
    });
  });

  it('avoids more than 3 consecutive repeats', () => {
    const ex = generateStage1Exercise({
      notes: ['E4', 'F4', 'G4'],
      strings: [1],
      frets: [0, 1, 3],
      numberOfQuestions: 20,
      exerciseType: 'fretboard',
      avoidRepeats: true,
    });
    let streak = 1;
    for (let i = 1; i < ex.questions.length; i++) {
      if (ex.questions[i].note === ex.questions[i - 1].note) {
        streak += 1;
        expect(streak).toBeLessThanOrEqual(3);
      } else {
        streak = 1;
      }
    }
  });

  it('mini_study favors stepwise motion', () => {
    const ex = generateStage1Exercise({
      notes: ['E4', 'F4', 'G4'],
      strings: [1],
      frets: [0, 1, 3],
      numberOfQuestions: 12,
      exerciseType: 'mini_study',
      preferStepwiseMotion: true,
    });
    expect(stepwiseRatio(ex.questions)).toBeGreaterThan(0.5);
  });

  it('uses c1t3 audio path for G4', () => {
    const ex = generateStage1Exercise({
      notes: ['G4'],
      strings: [1],
      frets: [3],
      numberOfQuestions: 1,
      exerciseType: 'fretboard',
    });
    expect(ex.questions[0].audioFile).toContain('c1t3.mp3');
  });

  it('exam generates requested question count', () => {
    const ex = generateStage1Exercise({
      notes: ['E4', 'F4', 'G4', 'B3', 'C4', 'D4'],
      strings: [1, 2],
      frets: [0, 1, 3],
      numberOfQuestions: 14,
      exerciseType: 'exam',
    });
    expect(ex.questions).toHaveLength(14);
  });
});
