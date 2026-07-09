import { isStage1BlockUnlocked, getUnlockedStage1Notes } from '../../data/curriculum/stage1/unlock';
import { emptyProgress, ProgressState } from '../types';

describe('stage1 unlock', () => {
  it('block 0 is always unlocked', () => {
    expect(isStage1BlockUnlocked('stage1-block0', emptyProgress)).toBe(true);
  });

  it('block 1 locked until block 0 completed', () => {
    expect(isStage1BlockUnlocked('stage1-block1', emptyProgress)).toBe(false);
    const state: ProgressState = {
      ...emptyProgress,
      blocks: {
        'stage1-block0': {
          bestStars: 1,
          attempts: 1,
          completed: true,
          examPassed: false,
        },
      },
    };
    expect(isStage1BlockUnlocked('stage1-block1', state)).toBe(true);
  });

  it('block 2 locked until block 1 exam passed', () => {
    const state: ProgressState = {
      ...emptyProgress,
      blocks: {
        'stage1-block0': { bestStars: 1, attempts: 1, completed: true, examPassed: false },
        'stage1-block1': { bestStars: 0, attempts: 1, completed: false, examPassed: false },
      },
    };
    expect(isStage1BlockUnlocked('stage1-block2', state)).toBe(false);

    state.blocks['stage1-block1'] = {
      bestStars: 1,
      attempts: 2,
      completed: true,
      examPassed: true,
    };
    expect(isStage1BlockUnlocked('stage1-block2', state)).toBe(true);
  });

  it('returns default notes when nothing unlocked', () => {
    const notes = getUnlockedStage1Notes(emptyProgress);
    expect(notes).toEqual(['E4', 'F4', 'G4']);
  });
});
