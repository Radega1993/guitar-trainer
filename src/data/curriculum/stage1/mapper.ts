import { Stage, StageBlock, StageExerciseType, StudyBlock, StudyLevel, TheoryLesson } from '../types';
import { STAGE1_STAR_THRESHOLDS } from './config';
import { stage1 } from './stage1';

function mapExerciseType(stageType: StageExerciseType) {
  switch (stageType) {
    case 'recognition':
      return 'note-identification' as const;
    case 'fretboard':
      return 'position-matching' as const;
    case 'scrolling_reading':
    case 'speed':
      return 'reading-speed' as const;
    case 'mini_study':
      return 'mini-study' as const;
    case 'exam':
      return 'exam' as const;
    case 'theory':
      return 'theory' as const;
    case 'quiz':
      return 'quiz' as const;
    default:
      return 'position-matching' as const;
  }
}

function theoryToLesson(block: StageBlock): TheoryLesson[] {
  return block.theory.map((t) => ({
    id: t.id,
    title: t.title,
    summary: t.pages[0]?.body ?? '',
    keyConcepts: t.pages.map((p) => p.title),
    relatedNotes: [],
  }));
}

function getPrerequisiteBlockIds(block: StageBlock, allBlocks: StageBlock[]): string[] {
  if (block.order === 0) return [];
  const prev = allBlocks.find((b) => b.order === block.order - 1);
  return prev ? [prev.id] : [];
}

function mapStageLevel(block: StageBlock, level: StageBlock['levels'][number], order: number): StudyLevel {
  const configId = `${level.id}-config`;
  const passMs = level.config.passRules.maxAverageResponseTime * 1000;
  const accuracyMin = 1 - level.config.passRules.maxErrorRate;

  return {
    id: level.id,
    blockId: block.id,
    order,
    title: level.title,
    goal: level.objective,
    levelRefIds: [level.id],
    theoryLessonIds: level.theoryId ? [level.theoryId] : [],
    exerciseConfigs: [
      {
        id: configId,
        exerciseType: mapExerciseType(level.type),
        notePool: level.config.notes,
        allowedStrings: level.config.strings,
        fretRange: {
          min: Math.min(...level.config.frets, 0),
          max: Math.max(...level.config.frets, 3),
        },
        timing: {
          targetResponseMs: passMs,
          maxSessionTimeMs: level.config.timeLimitPerQuestion
            ? level.config.timeLimitPerQuestion * 1000 * level.config.numberOfQuestions
            : undefined,
        },
        feedbackMode: 'immediate',
        passCriteria: {
          accuracyMin,
          maxAvgResponseMs: passMs,
          minQuestions: Math.max(1, level.config.numberOfQuestions),
        },
      },
    ],
    starThresholds: STAGE1_STAR_THRESHOLDS,
    unlockRequirements: {
      previousLevelId: level.unlockAfterLevelId,
    },
    miniStudies:
      level.type === 'mini_study'
        ? [
            {
              id: `mini:${level.id}`,
              title: level.title,
              focus: level.objective,
              exerciseConfigId: configId,
            },
          ]
        : [],
    examRef: level.type === 'exam' ? level.id : undefined,
    stageLevelType: level.type,
    stageConfig: level.config,
    stageTheoryId: level.theoryId,
    quizQuestions: level.quizQuestions,
  };
}

export function stage1ToStudyBlocks(source: Stage = stage1): StudyBlock[] {
  return source.blocks.map((block) => {
    const levels = block.levels.map((level, idx) => mapStageLevel(block, level, idx + 1));
    const examLevel = block.examLevelId
      ? block.levels.find((l) => l.id === block.examLevelId)
      : undefined;

    return {
      id: block.id,
      order: block.order,
      title: block.title,
      description: block.description,
      pedagogicalFocus: block.description,
      targetOutcomes: block.theory.map((t) => t.title),
      prerequisiteBlockIds: getPrerequisiteBlockIds(block, source.blocks),
      levels,
      theoryLessons: theoryToLesson(block),
      blockExam: examLevel
        ? {
            id: `exam-${block.id}`,
            title: examLevel.title,
            exerciseConfigId: `${examLevel.id}-config`,
            passCriteria: {
              accuracyMin: 1 - examLevel.config.passRules.maxErrorRate,
              maxAvgResponseMs: examLevel.config.passRules.maxAverageResponseTime * 1000,
              minQuestions: examLevel.config.numberOfQuestions,
            },
          }
        : undefined,
      reward: block.order === 9 ? 'Etapa 1 completada' : undefined,
    };
  });
}

export const STAGE1_BLOCKS = stage1ToStudyBlocks();
