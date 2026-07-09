import { emptyProgress } from '../../../storage/types';
import {
  getStageAvailability,
  getStage1Progress,
  getStageStatusLabel,
} from '../roadmapProgress';
import { CURRICULUM_ROADMAP } from '../roadmap';

describe('roadmapProgress', () => {
  it('stage 1 starts active with zero progress', () => {
    const p = getStage1Progress(emptyProgress);
    expect(p.completedBlocks).toBe(0);
    expect(p.isComplete).toBe(false);
  });

  it('stage 2 is locked before stage 1 complete', () => {
    const stage2 = CURRICULUM_ROADMAP[1];
    expect(getStageAvailability(stage2, emptyProgress)).toBe('locked');
    expect(getStageStatusLabel(stage2, emptyProgress)).toContain('desbloquea');
  });

  it('stage 2 shows próximamente after stage 1 complete', () => {
    const state = {
      ...emptyProgress,
      blocks: {
        'stage1-block9': {
          bestStars: 3,
          attempts: 1,
          completed: true,
          examPassed: true,
        },
      },
    };
    const stage2 = CURRICULUM_ROADMAP[1];
    expect(getStageAvailability(stage2, state)).toBe('coming_soon');
    expect(getStageStatusLabel(stage2, state)).toBe('Próximamente');
  });

  it('stage 3 stays locked until stage 2 is complete', () => {
    const state = {
      ...emptyProgress,
      blocks: {
        'stage1-block9': {
          bestStars: 3,
          attempts: 1,
          completed: true,
          examPassed: true,
        },
      },
    };
    const stage3 = CURRICULUM_ROADMAP[2];
    expect(getStageAvailability(stage3, state)).toBe('locked');
  });

  it('stage 5 is always post_mvp', () => {
    const stage5 = CURRICULUM_ROADMAP[4];
    expect(getStageAvailability(stage5, emptyProgress)).toBe('post_mvp');
  });
});
