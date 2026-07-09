export type ExerciseType =
  | 'note-identification'
  | 'position-matching'
  | 'reading-speed'
  | 'mini-study'
  | 'exam'
  | 'theory'
  | 'quiz';

export type StageExerciseType =
  | 'theory'
  | 'quiz'
  | 'recognition'
  | 'fretboard'
  | 'scrolling_reading'
  | 'speed'
  | 'mini_study'
  | 'exam';

export interface TheoryPage {
  title: string;
  body: string;
  image?: {
    asset: string;
    caption?: string;
    attribution: string;
    sourceUrl?: string;
  };
}

export interface TheoryContent {
  id: string;
  title: string;
  pages: TheoryPage[];
}

export interface QuizOption {
  id: string;
  label: string;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: QuizOption[];
  correctOptionId: string;
}

export interface StageLevelConfig {
  notes: string[];
  strings: number[];
  frets: number[];
  numberOfQuestions: number;
  animation: boolean;
  sound: boolean;
  allowOnlyExactString: boolean;
  timeLimitPerQuestion: number | null;
  passRules: {
    maxErrorRate: number;
    maxAverageResponseTime: number;
  };
  animationSpeed?: 'slow' | 'normal' | 'fast';
  preferStepwiseMotion?: boolean;
  avoidRepeats?: boolean;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface StageLevel {
  id: string;
  title: string;
  type: StageExerciseType;
  objective: string;
  theoryId?: string;
  config: StageLevelConfig;
  unlockAfterLevelId?: string;
  quizQuestions?: QuizQuestion[];
}

export interface StageBlock {
  id: string;
  title: string;
  description: string;
  order: number;
  theory: TheoryContent[];
  levels: StageLevel[];
  examLevelId?: string;
  requiresExamToUnlockNext?: boolean;
}

export interface Stage {
  id: string;
  title: string;
  description: string;
  order: number;
  blocks: StageBlock[];
}

export interface PassCriteria {
  accuracyMin: number;
  maxAvgResponseMs: number;
  minQuestions: number;
  maxWrong?: number;
}

export interface StarCriteria {
  stars: 1 | 2 | 3;
  accuracyMin: number;
  maxAvgResponseMs: number;
}

export interface TheoryLesson {
  id: string;
  title: string;
  summary: string;
  keyConcepts: string[];
  relatedNotes: string[];
  practiceTips?: string[];
}

export interface ExerciseConfig {
  id: string;
  exerciseType: ExerciseType;
  notePool: string[];
  allowedStrings: number[];
  fretRange: {
    min: number;
    max: number;
  };
  timing: {
    targetResponseMs: number;
    maxSessionTimeMs?: number;
  };
  feedbackMode: 'immediate' | 'deferred';
  passCriteria: PassCriteria;
}

export interface MiniStudy {
  id: string;
  title: string;
  focus: string;
  exerciseConfigId: string;
}

export interface BlockExam {
  id: string;
  title: string;
  exerciseConfigId: string;
  passCriteria: PassCriteria;
}

export interface StudyLevel {
  id: string;
  blockId: string;
  order: number;
  title: string;
  goal: string;
  levelRefIds: string[];
  theoryLessonIds: string[];
  exerciseConfigs: ExerciseConfig[];
  starThresholds: StarCriteria[];
  unlockRequirements: {
    previousLevelId?: string;
  };
  miniStudies: MiniStudy[];
  examRef?: string;
  /** Stage 1 metadata when mapped from Stage curriculum. */
  stageLevelType?: StageExerciseType;
  stageConfig?: StageLevelConfig;
  stageTheoryId?: string;
  quizQuestions?: QuizQuestion[];
}

export interface StudyBlock {
  id: string;
  order: number;
  title: string;
  description: string;
  pedagogicalFocus: string;
  targetOutcomes: string[];
  prerequisiteBlockIds: string[];
  levels: StudyLevel[];
  theoryLessons: TheoryLesson[];
  blockExam?: BlockExam;
  reward?: string;
}

