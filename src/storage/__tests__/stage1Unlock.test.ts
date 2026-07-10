import { isStage1BlockUnlocked, getUnlockedStage1Notes } from '../../data/curriculum/stage1/unlock';
import { emptyProgress, ProgressState } from '../types';

describe('stage1 unlock', () => {
  it('block 1 is unlocked from the start (MVP)', () => {
    expect(isStage1BlockUnlocked('stage1-block1', emptyProgress)).toBe(true);
  });

  it('block 2 locked until block 1 exam passed', () => {
    expect(isStage1BlockUnlocked('stage1-block2', emptyProgress)).toBe(false);

    const state: ProgressState = {
      ...emptyProgress,
      blocks: {
        'stage1-block1': {
          bestStars: 1,
          attempts: 2,
          completed: true,
          examPassed: true,
        },
      },
    };
    expect(isStage1BlockUnlocked('stage1-block2', state)).toBe(true);
  });

  it('returns default notes when nothing unlocked', () => {
    const notes = getUnlockedStage1Notes(emptyProgress);
    expect(notes).toEqual(['E4', 'F4', 'G4']);
  });
});
