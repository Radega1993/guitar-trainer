import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { defaultSettings, NoteNamingSystem } from './types';

interface SettingsStore {
  noteNamingSystem: NoteNamingSystem;
  setNoteNamingSystem: (system: NoteNamingSystem) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      noteNamingSystem: defaultSettings.noteNamingSystem,
      setNoteNamingSystem: (noteNamingSystem) => set({ noteNamingSystem }),
    }),
    {
      name: '@guitar-trainer/settings/v1',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ noteNamingSystem: state.noteNamingSystem }),
    }
  )
);
