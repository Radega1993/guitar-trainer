import { StageLevelConfig } from '../types';

export const STAGE1_PASS_RULES = {
  maxErrorRate: 0.2,
  maxAverageResponseTime: 2,
} as const;

export const STAGE1_STAR_THRESHOLDS = [
  { stars: 1 as const, accuracyMin: 0.8, maxAvgResponseMs: 2000 },
  { stars: 2 as const, accuracyMin: 0.9, maxAvgResponseMs: 1500 },
  { stars: 3 as const, accuracyMin: 1, maxAvgResponseMs: 1000 },
];

export function baseConfig(overrides: Partial<StageLevelConfig> = {}): StageLevelConfig {
  return {
    notes: [],
    strings: [1, 2, 3, 4, 5, 6],
    frets: [0, 1, 2, 3],
    numberOfQuestions: 10,
    animation: false,
    sound: true,
    allowOnlyExactString: true,
    timeLimitPerQuestion: null,
    passRules: { ...STAGE1_PASS_RULES },
    avoidRepeats: true,
    ...overrides,
  };
}

export function notesConfig(
  notes: string[],
  strings: number[],
  frets: number[],
  overrides: Partial<StageLevelConfig> = {}
): StageLevelConfig {
  return baseConfig({ notes, strings, frets, ...overrides });
}
