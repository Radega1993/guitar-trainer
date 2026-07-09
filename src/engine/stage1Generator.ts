import { Position } from '../domain/fretboard';
import { midiToNote } from '../domain/notes';
import { staffStepFromMidi } from '../domain/staff';
import { StageExerciseType } from '../data/curriculum/types';
import {
  getStage1Position,
  getStage1PositionByCoords,
  getStage1PositionsForNotes,
  Stage1Position,
} from '../data/curriculum/stage1/positions';
import { getPositionAudioRelativePath } from '../services/audio/noteAudioCatalog';
import { formatAmericanRawName } from '../settings/noteFormat';
import { NoteNamingSystem } from '../settings/types';
import { Question } from './exercise';

export interface GenerateStage1Params {
  notes: string[];
  strings: number[];
  frets: number[];
  numberOfQuestions: number;
  exerciseType: StageExerciseType;
  difficulty?: 'easy' | 'medium' | 'hard';
  avoidRepeats?: boolean;
  preferStepwiseMotion?: boolean;
  includeAudio?: boolean;
  animationSpeed?: 'slow' | 'normal' | 'fast';
  notationSystem?: NoteNamingSystem;
}

export interface Stage1Question {
  id: string;
  note: string;
  displayName: string;
  string: number;
  fret: number;
  validPositions: Position[];
  staffPosition: number;
  audioFile: string;
  expectedAnswer: string;
  position: Position;
  midi: number;
}

export interface Stage1Exercise {
  id: string;
  type: StageExerciseType;
  questions: Stage1Question[];
}

function makeId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function resolvePool(params: GenerateStage1Params): Stage1Position[] {
  let pool: Stage1Position[];

  if (params.notes.length > 0) {
    pool = getStage1PositionsForNotes(params.notes);
  } else if (params.strings.length > 0 && params.frets.length > 0) {
    pool = [];
    for (const string of params.strings) {
      for (const fret of params.frets) {
        const pos = getStage1PositionByCoords(string, fret);
        if (pos) pool.push(pos);
      }
    }
  } else {
    pool = getStage1PositionsForNotes(params.notes);
  }

  return pool.filter(
    (p) =>
      (params.strings.length === 0 || params.strings.includes(p.string)) &&
      (params.frets.length === 0 || params.frets.includes(p.fret))
  );
}

function midiDistance(a: number, b: number): number {
  return Math.abs(a - b);
}

function pickWithAntiRepeat(
  pool: Stage1Position[],
  recent: Stage1Position[],
  maxRepeat: number
): Stage1Position {
  const candidates = pool.filter((p) => {
    const tail = recent.slice(-maxRepeat);
    const count = tail.filter((r) => r.noteLabel === p.noteLabel).length;
    return count < maxRepeat;
  });
  const source = candidates.length > 0 ? candidates : pool;
  return source[Math.floor(Math.random() * source.length)];
}

function pickStepwise(
  pool: Stage1Position[],
  previous: Stage1Position | undefined
): Stage1Position {
  if (!previous || pool.length <= 1) {
    return pool[Math.floor(Math.random() * pool.length)];
  }

  const sorted = [...pool].sort(
    (a, b) => midiDistance(a.midi, previous.midi) - midiDistance(b.midi, previous.midi)
  );

  const stepwise = sorted.filter((p) => midiDistance(p.midi, previous.midi) <= 2);
  const prefer = stepwise.length > 0 ? stepwise : sorted;
  const top = prefer.slice(0, Math.min(3, prefer.length));
  return top[Math.floor(Math.random() * top.length)];
}

function toStage1Question(
  pos: Stage1Position,
  notationSystem: NoteNamingSystem
): Stage1Question {
  const position: Position = { string: pos.string, fret: pos.fret };
  return {
    id: makeId('q'),
    note: pos.noteLabel,
    displayName: formatAmericanRawName(pos.noteLabel, notationSystem),
    string: pos.string,
    fret: pos.fret,
    validPositions: [position],
    staffPosition: pos.staffPosition,
    audioFile: getPositionAudioRelativePath(position),
    expectedAnswer: pos.noteLabel,
    position,
    midi: pos.midi,
  };
}

function generateRandomSequence(
  pool: Stage1Position[],
  count: number,
  options: { avoidRepeats?: boolean; preferStepwise?: boolean }
): Stage1Position[] {
  if (pool.length === 0) return [];
  const out: Stage1Position[] = [];
  let prev: Stage1Position | undefined;

  for (let i = 0; i < count; i++) {
    let next: Stage1Position;
    if (options.preferStepwise) {
      next = pickStepwise(pool, prev);
    } else if (options.avoidRepeats !== false) {
      next = pickWithAntiRepeat(pool, out, 3);
    } else {
      next = pool[Math.floor(Math.random() * pool.length)];
    }
    out.push(next);
    prev = next;
  }

  return out;
}

export function generateStage1Exercise(params: GenerateStage1Params): Stage1Exercise {
  const pool = resolvePool(params);
  if (pool.length === 0) {
    throw new Error('No valid Stage 1 positions for the given filters');
  }

  const notation = params.notationSystem ?? 'both';
  const count = Math.max(1, params.numberOfQuestions);
  const preferStepwise =
    params.preferStepwiseMotion ?? params.exerciseType === 'mini_study';

  const sequence = generateRandomSequence(pool, count, {
    avoidRepeats: params.avoidRepeats,
    preferStepwise,
  });

  return {
    id: makeId('ex'),
    type: params.exerciseType,
    questions: sequence.map((p) => toStage1Question(p, notation)),
  };
}

export function stage1QuestionsToEngineQuestions(questions: Stage1Question[]): Question[] {
  return questions.map((q) => ({
    position: q.position,
    midi: q.midi,
    note: midiToNote(q.midi),
  }));
}

export function stepwiseRatio(questions: Stage1Question[]): number {
  if (questions.length < 2) return 1;
  let stepwise = 0;
  for (let i = 1; i < questions.length; i++) {
    const d = midiDistance(questions[i - 1].midi, questions[i].midi);
    if (d <= 2) stepwise += 1;
  }
  return stepwise / (questions.length - 1);
}
