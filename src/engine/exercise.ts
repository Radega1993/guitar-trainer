import { midiToNote, NoteName } from '../domain/notes';
import { Position, positionToMidi, samePosition } from '../domain/fretboard';
import { Level } from '../data/levels';

export interface Question {
  /** The exact position the student must find (the level's target). */
  position: Position;
  midi: number;
  note: NoteName;
}

function pick<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function toQuestion(position: Position): Question {
  const midi = positionToMidi(position);
  return { position, midi, note: midiToNote(midi) };
}

/**
 * Pick a random target from the level, avoiding repeating the previous one
 * (when the pool has more than one option) so drills feel varied.
 */
export function makeQuestion(level: Level, previous?: Question): Question {
  const pool = level.positions;
  if (pool.length === 0) {
    throw new Error(`Level ${level.id} has no positions`);
  }
  let position = pick(pool);
  if (previous && pool.length > 1) {
    let guard = 0;
    while (samePosition(position, previous.position) && guard < 20) {
      position = pick(pool);
      guard += 1;
    }
  }
  return toQuestion(position);
}

/** Build a full round of questions for a level. */
export function makeRound(level: Level): Question[] {
  const round: Question[] = [];
  let previous: Question | undefined;
  for (let i = 0; i < level.questionsPerRound; i++) {
    const q = makeQuestion(level, previous);
    round.push(q);
    previous = q;
  }
  return round;
}

/**
 * Corrección: the answer is correct only when the tapped position matches the
 * exact target position the level asks for (decisión de producto).
 */
export function isCorrect(question: Question, tapped: Position): boolean {
  return samePosition(question.position, tapped);
}
