import { Accidental, Letter, NoteName } from '../domain/notes';
import { NoteNamingSystem } from './types';

const LATIN_MAP: Record<Letter, string> = {
  C: 'Do',
  D: 'Re',
  E: 'Mi',
  F: 'Fa',
  G: 'Sol',
  A: 'La',
  B: 'Si',
};

function withAccidental(base: string, accidental: Accidental): string {
  return accidental === 'sharp' ? `${base}#` : base;
}

export function formatNoteName(note: NoteName, system: NoteNamingSystem, withOctave = false): string {
  const americanBase = withAccidental(note.letter, note.accidental);
  const latinBase = withAccidental(LATIN_MAP[note.letter], note.accidental);
  const american = withOctave ? `${americanBase}${note.octave}` : americanBase;
  const latin = withOctave ? `${latinBase}${note.octave}` : latinBase;

  if (system === 'american') return american;
  if (system === 'latin') return latin;
  return `${latin} / ${american}`;
}

export function parseAmericanNoteName(raw: string): NoteName | null {
  const match = /^([A-G])(#?)(-?\d+)?$/.exec(raw.trim());
  if (!match) return null;
  const letter = match[1] as Letter;
  const accidental: Accidental = match[2] === '#' ? 'sharp' : 'natural';
  const octave = match[3] != null ? Number(match[3]) : 4;
  if (Number.isNaN(octave)) return null;
  return { letter, accidental, octave };
}

export function formatAmericanRawName(raw: string, system: NoteNamingSystem): string {
  const parsed = parseAmericanNoteName(raw);
  if (!parsed) return raw;
  const hasOctave = /-?\d+$/.test(raw.trim());
  return formatNoteName(parsed, system, hasOctave);
}
