import { OPEN_STRING_MIDI, STRING_COUNT } from './tuning';

export interface Position {
  /** 1 (high e) .. 6 (low E). */
  string: number;
  /** 0 = open string. */
  fret: number;
}

export function positionToMidi(pos: Position): number {
  return OPEN_STRING_MIDI[pos.string - 1] + pos.fret;
}

/** All fretboard positions that produce the given written MIDI pitch. */
export function midiToPositions(midi: number, maxFret = 12): Position[] {
  const positions: Position[] = [];
  for (let string = 1; string <= STRING_COUNT; string++) {
    const fret = midi - OPEN_STRING_MIDI[string - 1];
    if (fret >= 0 && fret <= maxFret) {
      positions.push({ string, fret });
    }
  }
  return positions;
}

export function samePosition(a: Position, b: Position): boolean {
  return a.string === b.string && a.fret === b.fret;
}
