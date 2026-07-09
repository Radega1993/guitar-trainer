import { defaultSettings } from '../types';

describe('sound settings defaults', () => {
  it('defines audio defaults for MVP', () => {
    expect(defaultSettings.soundEnabled).toBe(true);
    expect(defaultSettings.playCorrectNoteAfterAnswer).toBe(true);
    expect(defaultSettings.feedbackSoundsEnabled).toBe(true);
    expect(defaultSettings.fretTapSoundEnabled).toBe(false);
  });
});

