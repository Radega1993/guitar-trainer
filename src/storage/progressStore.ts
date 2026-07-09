import AsyncStorage from '@react-native-async-storage/async-storage';
import { emptyProgress, ProgressState } from './types';

const STORAGE_KEY = '@guitar-trainer/progress/v1';

export async function loadProgress(): Promise<ProgressState> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyProgress;
    const parsed = JSON.parse(raw) as ProgressState;
    return {
      levels: parsed.levels ?? {},
      studyLevels: parsed.studyLevels ?? {},
      blocks: parsed.blocks ?? {},
      exams: parsed.exams ?? {},
      stats: { ...emptyProgress.stats, ...parsed.stats },
    };
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
