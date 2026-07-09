import {
  STAGE1_ALL_POSITIONS,
  getStage1Position,
  getStage1PositionsForBlock,
  isValidStage1Position,
} from '../positions';

describe('stage1 positions', () => {
  it('has 17 canonical positions', () => {
    expect(STAGE1_ALL_POSITIONS).toHaveLength(17);
  });

  it('maps G4 to string 1 fret 3', () => {
    const pos = getStage1Position('G4');
    expect(pos).toEqual(expect.objectContaining({ string: 1, fret: 3 }));
  });

  it('rejects invalid fret 2 on string 1 for G4', () => {
    expect(isValidStage1Position(1, 2)).toBe(false);
  });

  it('accepts open string positions', () => {
    expect(isValidStage1Position(1, 0)).toBe(true);
    expect(isValidStage1Position(6, 0)).toBe(true);
  });

  it('returns block note pools', () => {
    const block1 = getStage1PositionsForBlock('stage1-block1');
    expect(block1.map((p) => p.noteLabel).sort()).toEqual(['E4', 'F4', 'G4']);
  });
});
