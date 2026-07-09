import { emptyProgress } from '../types';

describe('progress unlock model', () => {
  it('starts with empty block and level progress maps', () => {
    expect(emptyProgress.studyLevels).toEqual({});
    expect(emptyProgress.blocks).toEqual({});
    expect(emptyProgress.exams).toEqual({});
  });
});

