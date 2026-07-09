import { getScoringOptionsForStudyLevel } from '../scoringOptions';
import { getStudyLevelById } from '../index';

describe('scoringOptions', () => {
  it('uses accuracy_only for quizzes', () => {
    const level = getStudyLevelById('stage1-block0-level2');
    expect(getScoringOptionsForStudyLevel(level).mode).toBe('accuracy_only');
  });

  it('uses accuracy_only for theory', () => {
    const level = getStudyLevelById('stage1-block0-level5');
    expect(level?.stageLevelType).toBe('theory');
    expect(getScoringOptionsForStudyLevel(level).mode).toBe('accuracy_only');
  });

  it('uses accuracy_only for block 0 fretboard drills', () => {
    const level = getStudyLevelById('stage1-block0-level4');
    expect(level?.title).toBe('Identifica cuerdas');
    expect(getScoringOptionsForStudyLevel(level).mode).toBe('accuracy_only');
  });

  it('uses accuracy_and_speed for recognition', () => {
    const level = getStudyLevelById('stage1-block1-level1');
    expect(getScoringOptionsForStudyLevel(level).mode).toBe('accuracy_and_speed');
  });
});
