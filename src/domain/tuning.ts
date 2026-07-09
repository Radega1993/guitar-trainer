/**
 * Standard classical guitar tuning, expressed as WRITTEN pitches (treble clef).
 *
 * Guitar music is notated one octave higher than it sounds, so these are the
 * pitches the student reads on the staff. Index 0 = string 1 (high e),
 * index 5 = string 6 (low E).
 *
 *   String 1 (e): E5 = MIDI 76
 *   String 2 (B): B4 = MIDI 71
 *   String 3 (G): G4 = MIDI 67
 *   String 4 (D): D4 = MIDI 62
 *   String 5 (A): A3 = MIDI 57
 *   String 6 (E): E3 = MIDI 52
 */
export const OPEN_STRING_MIDI = [76, 71, 67, 62, 57, 52];

export const STRING_COUNT = OPEN_STRING_MIDI.length;

/** Human labels for each string (1..6), thickest string is 6. */
export const STRING_LABELS = ['e', 'B', 'G', 'D', 'A', 'E'];
