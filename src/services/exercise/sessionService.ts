import { getLevel } from '../../data/levels';
import { getStudyBlock, resolveBlockLevels } from '../../data/studyBlocks';
import { getStudyBlockById, getStudyLevelById, STAGE1_BLOCKS } from '../../data/curriculum';
import { Question, makeRound } from '../../engine/exercise';
import {
  generateStage1Exercise,
  stage1QuestionsToEngineQuestions,
} from '../../engine/stage1Generator';
import { DEFAULT_INFINITE_OPTIONS, InfinitePracticeOptions, pickInfinitePositions } from '../../engine/practiceMode';
import { midiToNote } from '../../domain/notes';
import { positionToMidi } from '../../domain/fretboard';
import { StageExerciseType } from '../../data/curriculum/types';

export type SessionMode = 'level' | 'block' | 'infinite';

export interface ExerciseSession {
  id: string;
  mode: SessionMode;
  sourceId: string;
  metadata?: {
    studyLevelId?: string;
    exerciseConfigId?: string;
    blockId?: string;
    examId?: string;
    isMiniStudy?: boolean;
    stageExerciseType?: StageExerciseType;
  };
  questions: Question[];
  startedAt: string;
}

function makeId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function questionsFromStudyLevel(studyLevelId: string, exerciseConfigId?: string): Question[] {
  const studyLevel = getStudyLevelById(studyLevelId);
  if (!studyLevel) {
    throw new Error(`Study level not found: ${studyLevelId}`);
  }

  if (studyLevel.stageConfig && studyLevel.stageLevelType) {
    const config = studyLevel.stageConfig;
    const exercise = generateStage1Exercise({
      notes: config.notes,
      strings: config.strings,
      frets: config.frets,
      numberOfQuestions: config.numberOfQuestions || 10,
      exerciseType: studyLevel.stageLevelType,
      difficulty: config.difficulty,
      avoidRepeats: config.avoidRepeats,
      preferStepwiseMotion: config.preferStepwiseMotion,
      includeAudio: config.sound,
      animationSpeed: config.animationSpeed,
    });
    return stage1QuestionsToEngineQuestions(exercise.questions);
  }

  const config =
    studyLevel.exerciseConfigs.find((c) => c.id === exerciseConfigId) ??
    studyLevel.exerciseConfigs[0];
  if (config) {
    const exercise = generateStage1Exercise({
      notes: config.notePool,
      strings: config.allowedStrings,
      frets: [config.fretRange.min, config.fretRange.max],
      numberOfQuestions: config.passCriteria.minQuestions,
      exerciseType: 'fretboard',
    });
    return stage1QuestionsToEngineQuestions(exercise.questions);
  }

  const linkedLevels = studyLevel.levelRefIds
    .map((id) => getLevel(id))
    .filter((v): v is NonNullable<typeof v> => Boolean(v));
  return linkedLevels.flatMap((level) => makeRound(level));
}

export function createLevelSession(levelId: string): ExerciseSession {
  const level = getLevel(levelId);
  if (!level) {
    throw new Error(`Level not found: ${levelId}`);
  }
  return {
    id: makeId('sess_level'),
    mode: 'level',
    sourceId: levelId,
    questions: makeRound(level),
    startedAt: new Date().toISOString(),
  };
}

export function createStage1LevelSession(studyLevelId: string, exerciseConfigId?: string): ExerciseSession {
  const studyLevel = getStudyLevelById(studyLevelId);
  if (!studyLevel) {
    throw new Error(`Study level not found: ${studyLevelId}`);
  }
  const questions = questionsFromStudyLevel(studyLevelId, exerciseConfigId);
  return {
    id: makeId('sess_stage1'),
    mode: 'level',
    sourceId: studyLevelId,
    metadata: {
      studyLevelId,
      exerciseConfigId: exerciseConfigId ?? studyLevel.exerciseConfigs[0]?.id,
      blockId: studyLevel.blockId,
      stageExerciseType: studyLevel.stageLevelType,
    },
    questions,
    startedAt: new Date().toISOString(),
  };
}

export function createStudyBlockSession(blockId: string): ExerciseSession {
  const block = getStudyBlockById(blockId);
  if (!block) {
    const legacy = getStudyBlock(blockId);
    if (!legacy) throw new Error(`Study block not found: ${blockId}`);
    const questions = resolveBlockLevels(blockId).flatMap((level) => makeRound(level));
    return {
      id: makeId('sess_block'),
      mode: 'block',
      sourceId: blockId,
      questions,
      startedAt: new Date().toISOString(),
    };
  }

  const questions = block.levels
    .filter((l) => l.stageLevelType && !['theory', 'quiz'].includes(l.stageLevelType))
    .flatMap((l) => questionsFromStudyLevel(l.id));

  return {
    id: makeId('sess_block'),
    mode: 'block',
    sourceId: blockId,
    metadata: { blockId },
    questions,
    startedAt: new Date().toISOString(),
  };
}

export function createInfiniteSession(
  options: Partial<InfinitePracticeOptions> = {}
): ExerciseSession {
  const merged = { ...DEFAULT_INFINITE_OPTIONS, ...options };
  const positions = pickInfinitePositions(merged);
  const questions: Question[] = positions.map((position) => {
    const midi = positionToMidi(position);
    return {
      position,
      midi,
      note: midiToNote(midi),
    };
  });
  return {
    id: makeId('sess_infinite'),
    mode: 'infinite',
    sourceId: 'infinite',
    questions,
    startedAt: new Date().toISOString(),
  };
}

export function createStudyLevelSession(
  studyLevelId: string,
  exerciseConfigId?: string
): ExerciseSession {
  return createStage1LevelSession(studyLevelId, exerciseConfigId);
}

export function createMiniStudySession(miniStudyId: string): ExerciseSession {
  const studyLevel = STAGE1_BLOCKS.flatMap((block) => block.levels).find((level) =>
    level.miniStudies.some((mini) => mini.id === miniStudyId)
  );
  if (!studyLevel) {
    throw new Error(`Mini study not found: ${miniStudyId}`);
  }
  const mini = studyLevel.miniStudies.find((item) => item.id === miniStudyId)!;
  const base = createStage1LevelSession(studyLevel.id, mini.exerciseConfigId);
  return {
    ...base,
    id: makeId('sess_mini'),
    metadata: {
      ...base.metadata,
      isMiniStudy: true,
    },
  };
}

export function createBlockExamSession(blockId: string): ExerciseSession {
  const block = getStudyBlockById(blockId);
  if (!block || !block.blockExam) {
    throw new Error(`Block exam not found: ${blockId}`);
  }

  const examLevel =
    block.levels.find((l) => l.id === block.blockExam?.exerciseConfigId.replace(/-config$/, '')) ??
    block.levels.find((l) => l.stageLevelType === 'exam');

  const questions = examLevel
    ? questionsFromStudyLevel(examLevel.id)
    : block.levels
        .filter((l) => l.stageLevelType && !['theory', 'quiz'].includes(l.stageLevelType))
        .flatMap((l) => questionsFromStudyLevel(l.id));

  return {
    id: makeId('sess_block_exam'),
    mode: 'block',
    sourceId: blockId,
    metadata: {
      blockId,
      examId: block.blockExam.id,
      exerciseConfigId: block.blockExam.exerciseConfigId,
      stageExerciseType: 'exam',
    },
    questions,
    startedAt: new Date().toISOString(),
  };
}
