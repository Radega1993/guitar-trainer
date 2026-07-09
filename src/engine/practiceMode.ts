import { LEVELS } from '../data/levels';
import { Position, positionToMidi } from '../domain/fretboard';
import { isNatural, midiToNote } from '../domain/notes';

export interface InfinitePracticeOptions {
  maxFret: number;
  strings: number[];
  naturalOnly: boolean;
  totalQuestions: number;
}

export const DEFAULT_INFINITE_OPTIONS: InfinitePracticeOptions = {
  maxFret: 4,
  strings: [1, 2, 3, 4, 5, 6],
  naturalOnly: true,
  totalQuestions: 20,
};

export function buildInfinitePool(options: InfinitePracticeOptions): Position[] {
  const all = LEVELS.flatMap((l) => l.positions);
  return all.filter((pos) => {
    if (!options.strings.includes(pos.string)) return false;
    if (pos.fret > options.maxFret) return false;
    if (!options.naturalOnly) return true;
    return isNatural(midiToNote(positionToMidi(pos)));
  });
}

export function pickInfinitePositions(
  options: InfinitePracticeOptions,
  rng: () => number = Math.random
): Position[] {
  const pool = buildInfinitePool(options);
  if (pool.length === 0) return [];
  const out: Position[] = [];
  let prev: Position | null = null;
  for (let i = 0; i < options.totalQuestions; i++) {
    let candidate = pool[Math.floor(rng() * pool.length)];
    let guard = 0;
    while (prev && candidate.string === prev.string && candidate.fret === prev.fret && guard < 8) {
      candidate = pool[Math.floor(rng() * pool.length)];
      guard += 1;
    }
    out.push(candidate);
    prev = candidate;
  }
  return out;
}
