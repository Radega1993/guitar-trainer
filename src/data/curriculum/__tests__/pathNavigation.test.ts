import { emptyProgress } from '../../../storage/types';
import {
  buildLearningPathSections,
  getActiveBlockIndex,
  getCurrentLessonNode,
} from '../learningPath';
import {
  resolveLessonForLevel,
  resolveNextLesson,
  resolveNextLessonAfterCompleting,
} from '../pathNavigation';

const unlockAll = () => true;
const unlockNone = () => false;

function progressWithLevel(levelId: string) {
  return {
    ...emptyProgress,
    studyLevels: {
      [levelId]: {
        bestStars: 1,
        bestAccuracy: 1,
        rounds: 1,
        completed: true,
      },
    },
  };
}

describe('learningPath sections', () => {
  it('builds 10 module sections for stage 1', () => {
    const sections = buildLearningPathSections(emptyProgress, unlockAll);
    expect(sections).toHaveLength(10);
    expect(sections[0].moduleTitle).toBe('Bienvenido a la guitarra');
    expect(sections[1].moduleTitle).toBe('Primera cuerda');
  });

  it('lists individual lessons inside block 0', () => {
    const sections = buildLearningPathSections(emptyProgress, unlockAll);
    expect(sections[0].lessons.length).toBe(10);
    expect(sections[0].lessons[0].studyLevelId).toBe('stage1-block0-level1');
  });

  it('marks first lesson as current on fresh progress', () => {
    const sections = buildLearningPathSections(emptyProgress, unlockAll);
    expect(sections[0].lessons[0].state).toBe('current');
    expect(sections[0].lessons[1].state).toBe('locked');
    expect(getCurrentLessonNode(emptyProgress, unlockAll)?.studyLevelId).toBe(
      'stage1-block0-level1'
    );
  });

  it('locks all lessons when block locked', () => {
    const sections = buildLearningPathSections(emptyProgress, unlockNone);
    expect(sections.every((s) => s.blockLocked)).toBe(true);
    expect(sections[0].lessons.every((l) => l.state === 'locked')).toBe(true);
  });

  it('marks completed lessons as replayable', () => {
    const state = progressWithLevel('stage1-block0-level1');
    const sections = buildLearningPathSections(state, unlockAll);
    expect(sections[0].lessons[0].state).toBe('completed');
    expect(sections[0].lessons[1].state).toBe('current');
  });

  it('resolves active block from current lesson', () => {
    const sections = buildLearningPathSections(emptyProgress, unlockAll);
    expect(getActiveBlockIndex(sections, emptyProgress, unlockAll)).toBe(0);
  });
});

describe('pathNavigation', () => {
  it('resolves first theory lesson for block 0', () => {
    const dest = resolveNextLesson('stage1-block0', emptyProgress);
    expect(dest?.screen).toBe('TheoryLesson');
    expect(dest?.params.studyLevelId).toBe('stage1-block0-level1');
  });

  it('resolves first recognition for block 1', () => {
    const dest = resolveNextLesson('stage1-block1', emptyProgress);
    expect(dest?.screen).toBe('Recognition');
  });

  it('resolves next lesson after completing theory level 1', () => {
    const dest = resolveNextLessonAfterCompleting('stage1-block0-level1', emptyProgress);
    expect(dest?.screen).toBe('Quiz');
    expect(dest?.params.studyLevelId).toBe('stage1-block0-level2');
  });

  it('allows replaying a completed lesson directly', () => {
    const state = progressWithLevel('stage1-block0-level1');
    const dest = resolveLessonForLevel('stage1-block0-level1', state);
    expect(dest?.screen).toBe('TheoryLesson');
    expect(dest?.params.studyLevelId).toBe('stage1-block0-level1');
  });

  it('blocks locked lessons', () => {
    const dest = resolveLessonForLevel('stage1-block0-level3', emptyProgress);
    expect(dest).toBeNull();
  });
});
