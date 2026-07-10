import AsyncStorage from '@react-native-async-storage/async-storage';
import { emptyProgress, ProgressState } from './types';

const STORAGE_KEY = '@guitar-trainer/progress/v1';

function migrateProgress(state: ProgressState): ProgressState {
  const studyLevels = Object.fromEntries(
    Object.entries(state.studyLevels).filter(([id]) => !id.startsWith('stage1-block0-'))
  );
  const blocks = Object.fromEntries(
    Object.entries(state.blocks).filter(([id]) => id !== 'stage1-block0')
  );
  if (
    Object.keys(studyLevels).length === Object.keys(state.studyLevels).length &&
    Object.keys(blocks).length === Object.keys(state.blocks).length
  ) {
    return state;
  }
  return { ...state, studyLevels, blocks };
}

export async function loadProgress(): Promise<ProgressState> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyProgress;
    const parsed = JSON.parse(raw) as ProgressState;
    const merged: ProgressState = {
      levels: parsed.levels ?? {},
      studyLevels: parsed.studyLevels ?? {},
      blocks: parsed.blocks ?? {},
      exams: parsed.exams ?? {},
      stats: { ...emptyProgress.stats, ...parsed.stats },
    };
    return migrateProgress(merged);
  } catch {
    return emptyProgress;
  }
}

export async function saveProgress(state: ProgressState): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Offline persistence is best-effort; ignore write failures.
  }
}

export async function clearProgress(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
