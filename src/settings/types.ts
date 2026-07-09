export type NoteNamingSystem = 'american' | 'latin' | 'both';

export interface SettingsState {
  noteNamingSystem: NoteNamingSystem;
  soundEnabled: boolean;
  playCorrectNoteAfterAnswer: boolean;
  feedbackSoundsEnabled: boolean;
  fretTapSoundEnabled: boolean;
}

export const defaultSettings: SettingsState = {
  noteNamingSystem: 'both',
  soundEnabled: true,
  playCorrectNoteAfterAnswer: true,
  feedbackSoundsEnabled: true,
  fretTapSoundEnabled: false,
};
