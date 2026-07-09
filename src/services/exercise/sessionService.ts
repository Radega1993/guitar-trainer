import { getLevel } from '../../data/levels';
import { getStudyBlock, resolveBlockLevels } from '../../data/studyBlocks';
import { getStudyBlockById, getStudyLevelById, INITIAL_STUDY_BLOCKS } from '../../data/curriculum';
import { Question, makeRound } from '../../engine/exercise';
import { DEFAULT_INFINITE_OPTIONS, InfinitePracticeOptions, pickInfinitePositions } from '../../engine/practiceMode';
import { midiToNote } from '../../domain/notes';
import { positionToMidi } from '../../domain/fretboard';

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
  };
  questions: Question[];
  startedAt: string;
}

function makeId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
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

export function createStudyBlockSession(blockId: string): ExerciseSession {
  const block = getStudyBlock(blockId);
  if (!block) {
    throw new Error(`Study block not found: ${blockId}`);
  }
  const questions = resolveBlockLevels(blockId).flatMap((level) => makeRound(level));
  return {
    id: makeId('sess_block'),
    mode: 'block',
    sourceId: blockId,
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
  const studyLevel = getStudyLevelById(studyLevelId);
  if (!studyLevel) {
    throw new Error(`Study level not found: ${studyLevelId}`);
  }
  const linkedLevels = studyLevel.levelRefIds
    .map((id) => getLevel(id))
    .filter((v): v is NonNullable<typeof v> => Boolean(v));
  const questions = linkedLevels.flatMap((level) => makeRound(level));
  return {
    id: makeId('sess_study_level'),
    mode: 'level',
    sourceId: linkedLevels[0]?.id ?? studyLevelId,
    metadata: {
      studyLevelId,
      exerciseConfigId: exerciseConfigId ?? studyLevel.exerciseConfigs[0]?.id,
      blockId: studyLevel.blockId,
    },
    questions,
    startedAt: new Date().toISOString(),
  };
}

export function createMiniStudySession(miniStudyId: string): ExerciseSession {
  const studyLevel = INITIAL_STUDY_BLOCKS.flatMap((block) => block.levels).find((level) =>
    level.miniStudies.some((mini) => mini.id === miniStudyId)
  );
  if (!studyLevel) {
    throw new Error(`Mini study not found: ${miniStudyId}`);
  }
  const mini = studyLevel.miniStudies.find((item) => item.id === miniStudyId)!;
  const base = createStudyLevelSession(studyLevel.id, mini.exerciseConfigId);
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
  const questions = block.levels.flatMap((studyLevel) => {
    const linked = studyLevel.levelRefIds
      .map((id) => getLevel(id))
      .filter((v): v is NonNullable<typeof v> => Boolean(v));
    return linked.flatMap((level) => makeRound(level));
  });
  return {
    id: makeId('sess_block_exam'),
    mode: 'block',
    sourceId: blockId,
    metadata: {
      blockId,
      examId: block.blockExam.id,
      exerciseConfigId: block.blockExam.exerciseConfigId,
    },
    questions,
    startedAt: new Date().toISOString(),
  };
}
