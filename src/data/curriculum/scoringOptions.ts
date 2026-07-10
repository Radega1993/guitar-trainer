import { ScoringOptions } from '../../engine/scoring';
import { StudyLevel, StageExerciseType } from './types';
import { STAGE1_PASS_RULES, STAGE1_STAR_THRESHOLDS } from './stage1/config';

const ACCURACY_ONLY_TYPES: StageExerciseType[] = ['theory', 'quiz'];

export function getScoringOptionsForStudyLevel(level?: StudyLevel): ScoringOptions {
  if (!level) {
    return { mode: 'accuracy_and_speed' };
  }

  const isIntroFretboard =
    level.blockId === 'stage1-block0' && level.stageLevelType === 'fretboard';

  const mode =
    isIntroFretboard ||
    (level.stageLevelType != null && ACCURACY_ONLY_TYPES.includes(level.stageLevelType))
      ? 'accuracy_only'
      : 'accuracy_and_speed';

  const passRules = level.stageConfig?.passRules ?? STAGE1_PASS_RULES;
  const isFormativeQuiz = level.stageLevelType === 'quiz';

  return {
    mode,
    starThresholds: level.starThresholds ?? STAGE1_STAR_THRESHOLDS,
    passRules: {
      // Quizzes are formative: finishing unlocks the next lesson; stars still reflect accuracy.
      maxErrorRate: isFormativeQuiz ? 1 : passRules.maxErrorRate,
      maxAvgResponseMs: passRules.maxAverageResponseTime * 1000,
    },
  };
}
