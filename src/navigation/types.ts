import { RoundResult } from '../engine/scoring';
import { PracticeConfig } from '../engine/practiceConfig';
import { PracticeSummary } from '../analytics/practiceSummary';

export type RootStackParamList = {
  Home: undefined;
  LevelSelect: undefined;
  Exercise: {
    levelId?: string;
    studyLevelId?: string;
    exerciseConfigId?: string;
    sessionMode?: 'level' | 'block' | 'infinite';
    sourceId?: string;
  };
  Results: {
    levelId: string;
    result: RoundResult;
    studyLevelId?: string;
    title?: string;
  };
  Stats: undefined;
  Settings: undefined;
  StudyBlock: { blockId: string };
  InfinitePractice: undefined;
  PracticeSetup: undefined;
  PracticeSession: { config: PracticeConfig };
  PracticeSummary: { summary: PracticeSummary };
  TheoryLesson: { studyLevelId: string };
  Quiz: { studyLevelId: string };
  Recognition: { studyLevelId: string };
};
