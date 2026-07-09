import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { defaultSettings, NoteNamingSystem } from './types';

interface SettingsStore {
  noteNamingSystem: NoteNamingSystem;
  soundEnabled: boolean;
  playCorrectNoteAfterAnswer: boolean;
  feedbackSoundsEnabled: boolean;
  fretTapSoundEnabled: boolean;
  setNoteNamingSystem: (system: NoteNamingSystem) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setPlayCorrectNoteAfterAnswer: (enabled: boolean) => void;
  setFeedbackSoundsEnabled: (enabled: boolean) => void;
  setFretTapSoundEnabled: (enabled: boolean) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      noteNamingSystem: defaultSettings.noteNamingSystem,
      soundEnabled: defaultSettings.soundEnabled,
      playCorrectNoteAfterAnswer: defaultSettings.playCorrectNoteAfterAnswer,
      feedbackSoundsEnabled: defaultSettings.feedbackSoundsEnabled,
      fretTapSoundEnabled: defaultSettings.fretTapSoundEnabled,
      setNoteNamingSystem: (noteNamingSystem) => set({ noteNamingSystem }),
      setSoundEnabled: (soundEnabled) => set({ soundEnabled }),
      setPlayCorrectNoteAfterAnswer: (playCorrectNoteAfterAnswer) => set({ playCorrectNoteAfterAnswer }),
      setFeedbackSoundsEnabled: (feedbackSoundsEnabled) => set({ feedbackSoundsEnabled }),
      setFretTapSoundEnabled: (fretTapSoundEnabled) => set({ fretTapSoundEnabled }),
    }),
    {
      name: '@guitar-trainer/settings/v1',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        noteNamingSystem: state.noteNamingSystem,
        soundEnabled: state.soundEnabled,
        playCorrectNoteAfterAnswer: state.playCorrectNoteAfterAnswer,
        feedbackSoundsEnabled: state.feedbackSoundsEnabled,
        fretTapSoundEnabled: state.fretTapSoundEnabled,
      }),
    }
  )
);
