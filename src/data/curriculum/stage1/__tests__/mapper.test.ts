import { stage1 } from '../stage1';
import { stage1ToStudyBlocks } from '../mapper';

describe('stage1ToStudyBlocks', () => {
  const blocks = stage1ToStudyBlocks(stage1);

  it('maps 9 blocks', () => {
    expect(blocks).toHaveLength(9);
  });

  it('preserves all levels', () => {
    const totalLevels = stage1.blocks.reduce((sum, b) => sum + b.levels.length, 0);
    const mappedLevels = blocks.reduce((sum, b) => sum + b.levels.length, 0);
    expect(mappedLevels).toBe(totalLevels);
  });

  it('maps recognition to note-identification', () => {
    const block1 = blocks.find((b) => b.id === 'stage1-block1')!;
    const recognition = block1.levels.find((l) => l.stageLevelType === 'recognition');
    expect(recognition?.exerciseConfigs[0]?.exerciseType).toBe('note-identification');
  });

  it('sets exam on blocks with exam', () => {
    const block1 = blocks.find((b) => b.id === 'stage1-block1')!;
    expect(block1.blockExam).toBeDefined();
  });
});
