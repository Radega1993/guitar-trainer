export type ExerciseType =
  | 'note-identification'
  | 'position-matching'
  | 'reading-speed'
  | 'mini-study'
  | 'exam';

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

