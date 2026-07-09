export type NoteNamingSystem = 'american' | 'latin' | 'both';

export interface SettingsState {
  noteNamingSystem: NoteNamingSystem;
}

export const defaultSettings: SettingsState = {
  noteNamingSystem: 'both',
};
