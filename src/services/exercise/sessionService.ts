import { getLevel } from '../../data/levels';
import { getStudyBlock, resolveBlockLevels } from '../../data/studyBlocks';
import { Question, makeRound } from '../../engine/exercise';
import { DEFAULT_INFINITE_OPTIONS, InfinitePracticeOptions, pickInfinitePositions } from '../../engine/practiceMode';
import { midiToNote } from '../../domain/notes';
import { positionToMidi } from '../../domain/fretboard';

export type SessionMode = 'level' | 'block' | 'infinite';

export interface ExerciseSession {
  id: string;
  mode: SessionMode;
  sourceId: string;
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
