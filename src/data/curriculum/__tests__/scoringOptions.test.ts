import { summarizeRound } from '../../../engine/scoring';
import { getScoringOptionsForStudyLevel } from '../scoringOptions';
import { getStudyLevelById } from '../index';

describe('scoringOptions', () => {
  it('uses accuracy_only for quizzes', () => {
    const level = getStudyLevelById('stage1-block1-level3');
    expect(level?.stageLevelType).toBe('quiz');
    expect(getScoringOptionsForStudyLevel(level).mode).toBe('accuracy_only');
  });

  it('uses accuracy_only for theory', () => {
    const level = getStudyLevelById('stage1-block1-level2');
    expect(level?.stageLevelType).toBe('theory');
    expect(getScoringOptionsForStudyLevel(level).mode).toBe('accuracy_only');
  });

  it('uses accuracy_and_speed for recognition', () => {
    const level = getStudyLevelById('stage1-block1-level6');
    expect(level?.stageLevelType).toBe('recognition');
    expect(getScoringOptionsForStudyLevel(level).mode).toBe('accuracy_and_speed');
  });

  it('passes formative quizzes on completion even with mistakes', () => {
    const level = getStudyLevelById('stage1-block1-level5');
    expect(level?.title).toBe('Quiz: Mi');
    const options = getScoringOptionsForStudyLevel(level);
    const result = summarizeRound(2, 3, 5000, 1000, options);
    expect(result.passed).toBe(true);
    expect(result.stars).toBe(0);
  });
});
