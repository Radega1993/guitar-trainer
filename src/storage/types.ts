export interface LevelProgress {
  bestStars: number;
  bestAccuracy: number;
  rounds: number;
  completed: boolean;
}

export interface GlobalStats {
  totalQuestions: number;
  totalCorrect: number;
  totalTimeMs: number;
  roundsPlayed: number;
}

export interface ProgressState {
  levels: Record<string, LevelProgress>;
  stats: GlobalStats;
}

export const emptyStats: GlobalStats = {
  totalQuestions: 0,
  totalCorrect: 0,
  totalTimeMs: 0,
  roundsPlayed: 0,
};

export const emptyProgress: ProgressState = {
  levels: {},
  stats: emptyStats,
};
