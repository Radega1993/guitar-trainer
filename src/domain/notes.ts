export type Letter = 'C' | 'D' | 'E' | 'F' | 'G' | 'A' | 'B';
export type Accidental = 'natural' | 'sharp';

export interface NoteName {
  letter: Letter;
  accidental: Accidental;
  /** Scientific octave number (C4 = middle C = MIDI 60). */
  octave: number;
}

const SHARP_SPELLING: { letter: Letter; accidental: Accidental }[] = [
  { letter: 'C', accidental: 'natural' }, // 0
  { letter: 'C', accidental: 'sharp' }, // 1
  { letter: 'D', accidental: 'natural' }, // 2
  { letter: 'D', accidental: 'sharp' }, // 3
  { letter: 'E', accidental: 'natural' }, // 4
  { letter: 'F', accidental: 'natural' }, // 5
  { letter: 'F', accidental: 'sharp' }, // 6
  { letter: 'G', accidental: 'natural' }, // 7
  { letter: 'G', accidental: 'sharp' }, // 8
  { letter: 'A', accidental: 'natural' }, // 9
  { letter: 'A', accidental: 'sharp' }, // 10
  { letter: 'B', accidental: 'natural' }, // 11
];

const LETTER_INDEX: Record<Letter, number> = {
  C: 0,
  D: 1,
  E: 2,
  F: 3,
  G: 4,
  A: 5,
  B: 6,
};

const LETTER_NAME_ES: Record<Letter, string> = {
  C: 'Do',
  D: 'Re',
  E: 'Mi',
  F: 'Fa',
  G: 'Sol',
  A: 'La',
  B: 'Si',
};

/** Convert a MIDI note number to its (sharp-spelled) note name. */
export function midiToNote(midi: number): NoteName {
  const pc = ((midi % 12) + 12) % 12;
  const octave = Math.floor(midi / 12) - 1;
  const spelling = SHARP_SPELLING[pc];
  return { letter: spelling.letter, accidental: spelling.accidental, octave };
}

export function isNatural(note: NoteName): boolean {
  return note.accidental === 'natural';
}

/**
 * Diatonic value: a strictly increasing integer per staff step (letter),
 * ignoring accidentals. Used to place a note vertically on the staff.
 */
export function diatonicValue(note: NoteName): number {
  return note.octave * 7 + LETTER_INDEX[note.letter];
}

/** Spanish solfège name, e.g. "Do", "Sol#". */
export function noteNameEs(note: NoteName): string {
  return LETTER_NAME_ES[note.letter] + (note.accidental === 'sharp' ? '#' : '');
}

/** English/international name, e.g. "C", "G#4". */
export function noteNameEn(note: NoteName, withOctave = false): string {
  const base = note.letter + (note.accidental === 'sharp' ? '#' : '');
  return withOctave ? `${base}${note.octave}` : base;
}
