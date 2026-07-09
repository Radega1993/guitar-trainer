import {
  getFeedbackAudioRelativePath,
  getPositionAudioRelativePath,
  listPositionAudioKeys,
  positionToAudioKey,
} from '../noteAudioCatalog';

describe('noteAudioCatalog', () => {
  it('builds key from position', () => {
    expect(positionToAudioKey({ string: 2, fret: 10 })).toBe('c2t10');
  });

  it('resolves position and feedback paths', () => {
    expect(getPositionAudioRelativePath({ string: 1, fret: 0 })).toBe('/assets/audio/notes/c1t0.mp3');
    expect(getFeedbackAudioRelativePath('correct')).toBe('/assets/audio/feedback/correct.mp3');
  });

  it('lists all keys by max fret', () => {
    const keys = listPositionAudioKeys(2);
    expect(keys).toHaveLength(18);
    expect(keys[0]).toBe('c1t0');
    expect(keys[keys.length - 1]).toBe('c6t2');
  });
});

