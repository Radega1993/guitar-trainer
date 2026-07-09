const mockedSettings = {
  soundEnabled: true,
  playCorrectNoteAfterAnswer: true,
  feedbackSoundsEnabled: true,
  fretTapSoundEnabled: true,
};

jest.mock('../../../settings/store', () => ({
  useSettingsStore: {
    getState: () => mockedSettings,
  },
}));

jest.mock('../noteAudioPlayer', () => ({
  noteAudioPlayer: {
    preloadPositions: jest.fn(async () => {}),
    playPosition: jest.fn(async () => {}),
    playFeedback: jest.fn(async () => {}),
    stop: jest.fn(async () => {}),
    release: jest.fn(async () => {}),
  },
}));

import { audioService } from '../AudioService';
import { noteAudioPlayer } from '../noteAudioPlayer';

describe('AudioService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedSettings.soundEnabled = true;
    mockedSettings.playCorrectNoteAfterAnswer = true;
    mockedSettings.feedbackSoundsEnabled = true;
    mockedSettings.fretTapSoundEnabled = true;
  });

  it('plays position when sound is enabled', async () => {
    await audioService.playPosition({ string: 1, fret: 0 });
    expect(noteAudioPlayer.playPosition).toHaveBeenCalledTimes(1);
  });

  it('skips feedback when disabled', async () => {
    mockedSettings.feedbackSoundsEnabled = false;
    await audioService.playFeedback(true);
    expect(noteAudioPlayer.playFeedback).not.toHaveBeenCalled();
  });

  it('plays fret tap only when enabled', async () => {
    await audioService.playFretTap();
    expect(noteAudioPlayer.playFeedback).toHaveBeenCalledWith('tap');
  });
});

