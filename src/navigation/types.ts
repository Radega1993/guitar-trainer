import { RoundResult } from '../engine/scoring';

export type RootStackParamList = {
  Home: undefined;
  LevelSelect: undefined;
  Exercise: {
    levelId?: string;
    sessionMode?: 'level' | 'block' | 'infinite';
    sourceId?: string;
  };
  Results: { levelId: string; result: RoundResult };
  Stats: undefined;
  Settings: undefined;
  StudyBlock: { blockId: string };
  InfinitePractice: undefined;
};
