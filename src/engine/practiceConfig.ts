import { NoteNamingSystem } from '../settings/types';

export type PracticeSpeed = 'slow' | 'normal' | 'fast';

export interface PracticeConfig {
  blockIds: string[];
  levelIds: string[];
  strings: number[];
  notePool: string[];
  fretMin: number;
  fretMax: number;
  speed: PracticeSpeed;
  notationSystem: NoteNamingSystem;
  soundEnabled: boolean;
  timedMode: boolean;
  timeLimitSec: number;
  animated: boolean;
  onlyFailedNotes: boolean;
  includeLearnedNotes: boolean;
  saveStatsOnStop: boolean;
  batchSize: number;
}

export const defaultPracticeConfig: PracticeConfig = {
  blockIds: [],
  levelIds: [],
  strings: [1, 2, 3, 4, 5, 6],
  notePool: [],
  fretMin: 0,
  fretMax: 5,
  speed: 'normal',
  notationSystem: 'both',
  soundEnabled: true,
  timedMode: false,
  timeLimitSec: 180,
  animated: true,
  onlyFailedNotes: false,
  includeLearnedNotes: true,
  saveStatsOnStop: true,
  batchSize: 12,
};

function uniqNumbers(values: number[], min: number, max: number): number[] {
  return Array.from(new Set(values)).filter((v) => v >= min && v <= max);
}

export function normalizePracticeConfig(
  partial: Partial<PracticeConfig>,
  fallback: PracticeConfig = defaultPracticeConfig
): PracticeConfig {
  const merged: PracticeConfig = { ...fallback, ...partial };
  const fretMin = Math.max(0, Math.min(merged.fretMin, merged.fretMax));
  const fretMax = Math.max(fretMin, merged.fretMax);
  const strings = uniqNumbers(merged.strings, 1, 6);
  return {
    ...merged,
    fretMin,
    fretMax,
    strings: strings.length > 0 ? strings : fallback.strings,
    timeLimitSec: Math.max(15, merged.timeLimitSec),
    batchSize: Math.max(4, merged.batchSize),
  };
}

