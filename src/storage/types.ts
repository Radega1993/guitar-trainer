export interface LevelProgress {
  bestStars: number;
  bestAccuracy: number;
  rounds: number;
  completed: boolean;
}

export interface BlockProgress {
  bestStars: number;
  attempts: number;
  completed: boolean;
  examPassed: boolean;
}

export interface ExamProgress {
  attempts: number;
  bestScore: number;
  passedAt?: string;
}

export interface GlobalStats {
  totalQuestions: number;
  totalCorrect: number;
  totalTimeMs: number;
  roundsPlayed: number;
}

export interface ProgressState {
  levels: Record<string, LevelProgress>;
  studyLevels: Record<string, LevelProgress>;
  blocks: Record<string, BlockProgress>;
  exams: Record<string, ExamProgress>;
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
  studyLevels: {},
  blocks: {},
  exams: {},
  stats: emptyStats,
};
