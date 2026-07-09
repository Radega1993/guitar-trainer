import { loadCurriculumFromJs, loadCurriculumFromJson } from '../loader';

describe('curriculum loader', () => {
  it('loads js curriculum blocks', () => {
    const blocks = loadCurriculumFromJs();
    expect(blocks.length).toBeGreaterThanOrEqual(3);
  });

  it('validates json curriculum shape', () => {
    expect(() => loadCurriculumFromJson({})).toThrow();
    expect(() =>
      loadCurriculumFromJson([
        { id: 'x', order: 1, title: 'x', levels: [], theoryLessons: [] },
      ])
    ).not.toThrow();
  });
});

