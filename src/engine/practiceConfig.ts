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

export interface Stage1PracticePreset {
  id: string;
  label: string;
  config: Partial<PracticeConfig>;
}

export const STAGE1_PRACTICE_PRESETS: Stage1PracticePreset[] = [
  {
    id: 's1-string1',
    label: 'Primera cuerda',
    config: { strings: [1], notePool: ['E4', 'F4', 'G4'], fretMin: 0, fretMax: 3 },
  },
  {
    id: 's1-string2',
    label: 'Segunda cuerda',
    config: { strings: [2], notePool: ['B3', 'C4', 'D4'], fretMin: 0, fretMax: 3 },
  },
  {
    id: 's1-strings123',
    label: 'Tres primeras cuerdas',
    config: {
      strings: [1, 2, 3],
      notePool: ['E4', 'F4', 'G4', 'B3', 'C4', 'D4', 'G3', 'A3'],
      fretMin: 0,
      fretMax: 3,
    },
  },
  {
    id: 's1-bass',
    label: 'Bajos',
    config: {
      strings: [4, 5, 6],
      notePool: ['D3', 'E3', 'F3', 'A2', 'B2', 'C3', 'E2', 'F2', 'G2'],
      fretMin: 0,
      fretMax: 3,
    },
  },
  {
    id: 's1-full',
    label: 'Todas (1ª posición)',
    config: {
      strings: [1, 2, 3, 4, 5, 6],
      notePool: [
        'E4', 'F4', 'G4', 'B3', 'C4', 'D4', 'G3', 'A3', 'D3', 'E3', 'F3',
        'A2', 'B2', 'C3', 'E2', 'F2', 'G2',
      ],
      fretMin: 0,
      fretMax: 3,
    },
  },
  {
    id: 's1-failed',
    label: 'Solo notas falladas',
    config: { onlyFailedNotes: true, includeLearnedNotes: true },
  },
  {
    id: 's1-low',
    label: 'Cuerdas graves',
    config: { strings: [4, 5, 6], fretMin: 0, fretMax: 3 },
  },
  {
    id: 's1-high',
    label: 'Cuerdas agudas',
    config: { strings: [1, 2, 3], fretMin: 0, fretMax: 3 },
  },
];

