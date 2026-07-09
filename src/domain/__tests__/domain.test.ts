import { midiToNote, isNatural, noteNameEn, noteNameEs, diatonicValue } from '../notes';
import { OPEN_STRING_MIDI } from '../tuning';
import { positionToMidi, midiToPositions, samePosition } from '../fretboard';
import { staffStep, BOTTOM_LINE_NOTE, MIDDLE_STEP, TOP_STEP } from '../staff';

describe('notes', () => {
  it('maps MIDI to scientific pitch', () => {
    expect(midiToNote(60)).toEqual({ letter: 'C', accidental: 'natural', octave: 4 });
    expect(midiToNote(69)).toEqual({ letter: 'A', accidental: 'natural', octave: 4 });
    expect(midiToNote(61)).toEqual({ letter: 'C', accidental: 'sharp', octave: 4 });
  });

  it('detects natural notes', () => {
    expect(isNatural(midiToNote(60))).toBe(true);
    expect(isNatural(midiToNote(61))).toBe(false);
  });

  it('renders names in both systems', () => {
    expect(noteNameEn(midiToNote(67), true)).toBe('G4');
    expect(noteNameEs(midiToNote(67))).toBe('Sol');
    expect(noteNameEs(midiToNote(66))).toBe('Fa#');
  });

  it('orders diatonic values by staff step', () => {
    expect(diatonicValue(midiToNote(60))).toBeLessThan(diatonicValue(midiToNote(62)));
    // C#4 and C4 share the same diatonic value (same staff line)
    expect(diatonicValue(midiToNote(61))).toBe(diatonicValue(midiToNote(60)));
  });
});

describe('fretboard', () => {
  it('open strings match written tuning pitches', () => {
    expect(positionToMidi({ string: 1, fret: 0 })).toBe(76); // e -> E5
    expect(positionToMidi({ string: 6, fret: 0 })).toBe(52); // E -> E3
    expect(OPEN_STRING_MIDI[0]).toBe(76);
  });

  it('each fret adds a semitone', () => {
    expect(positionToMidi({ string: 1, fret: 1 })).toBe(77); // F5
    expect(positionToMidi({ string: 2, fret: 1 })).toBe(72); // C5
  });

  it('finds all positions for a pitch', () => {
    // C5 (MIDI 72) can be played on string 2 fret 1 and string 1... no,
    // e string open is E5, so C5 only appears on lower strings within range.
    const positions = midiToPositions(72, 5);
    expect(positions).toContainEqual({ string: 2, fret: 1 });
    expect(positions.every((p) => positionToMidi(p) === 72)).toBe(true);
  });

  it('compares positions', () => {
    expect(samePosition({ string: 3, fret: 2 }, { string: 3, fret: 2 })).toBe(true);
    expect(samePosition({ string: 3, fret: 2 }, { string: 3, fret: 3 })).toBe(false);
  });
});

describe('staff placement', () => {
  it('places E4 on the bottom line', () => {
    expect(staffStep(BOTTOM_LINE_NOTE)).toBe(0);
  });

  it('places B4 on the middle line and F5 on the top line', () => {
    expect(staffStep(midiToNote(71))).toBe(MIDDLE_STEP); // B4
    expect(staffStep(midiToNote(77))).toBe(TOP_STEP); // F5
  });

  it('places middle C below the staff (ledger line)', () => {
    expect(staffStep(midiToNote(60))).toBe(-2); // C4 -> one ledger line below
  });
});
