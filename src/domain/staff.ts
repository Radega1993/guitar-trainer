import { diatonicValue, midiToNote, NoteName } from './notes';

/**
 * The bottom line of the treble staff is E4. We measure vertical position of
 * any note as the number of diatonic half-steps (line/space units) above that
 * line. 0 = on the bottom line, +1 = first space above it, and so on.
 */
export const BOTTOM_LINE_NOTE: NoteName = {
  letter: 'E',
  accidental: 'natural',
  octave: 4,
};

const BOTTOM_LINE_DIATONIC = diatonicValue(BOTTOM_LINE_NOTE);

/** Middle line of the treble staff is B4 -> step 4. Used for stem direction. */
export const MIDDLE_STEP = 4;
/** Top line of the treble staff is F5 -> step 8. */
export const TOP_STEP = 8;

export function staffStep(note: NoteName): number {
  return diatonicValue(note) - BOTTOM_LINE_DIATONIC;
}

export function staffStepFromMidi(midi: number): number {
  return staffStep(midiToNote(midi));
}
