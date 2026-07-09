import { formatAmericanRawName, formatNoteName, parseAmericanNoteName } from '../noteFormat';
import { NoteName } from '../../domain/notes';

const G4: NoteName = { letter: 'G', accidental: 'natural', octave: 4 };
const CSharp5: NoteName = { letter: 'C', accidental: 'sharp', octave: 5 };

describe('noteFormat', () => {
  it('formats note names in american system', () => {
    expect(formatNoteName(G4, 'american')).toBe('G');
    expect(formatNoteName(CSharp5, 'american')).toBe('C#');
    expect(formatNoteName(CSharp5, 'american', true)).toBe('C#5');
  });

  it('formats note names in latin system', () => {
    expect(formatNoteName(G4, 'latin')).toBe('Sol');
    expect(formatNoteName(CSharp5, 'latin')).toBe('Do#');
    expect(formatNoteName(CSharp5, 'latin', true)).toBe('Do#5');
  });

  it('formats note names in both systems', () => {
    expect(formatNoteName(G4, 'both')).toBe('Sol / G');
    expect(formatNoteName(CSharp5, 'both', true)).toBe('Do#5 / C#5');
  });

  it('parses american raw note names', () => {
    expect(parseAmericanNoteName('F4')).toEqual({ letter: 'F', accidental: 'natural', octave: 4 });
    expect(parseAmericanNoteName('C#5')).toEqual({
      letter: 'C',
      accidental: 'sharp',
      octave: 5,
    });
    expect(parseAmericanNoteName('bad-input')).toBeNull();
  });

  it('formats american raw names for presentation only', () => {
    expect(formatAmericanRawName('G4', 'latin')).toBe('Sol4');
    expect(formatAmericanRawName('C#5', 'both')).toBe('Do#5 / C#5');
    expect(formatAmericanRawName('unknown', 'latin')).toBe('unknown');
  });
});
