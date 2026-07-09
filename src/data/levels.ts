import { isNatural, midiToNote } from '../domain/notes';
import { Position, positionToMidi } from '../domain/fretboard';

export interface Level {
  id: string;
  order: number;
  name: string;
  /** Short pedagogical description shown in the level list. */
  description: string;
  /** Which strings (1..6) are involved, used for hints and neck sizing. */
  strings: number[];
  /** Highest fret used, for sizing the interactive neck. */
  maxFret: number;
  /** The pool of target positions the student must read and locate. */
  positions: Position[];
  questionsPerRound: number;
}

/**
 * Enumerate the natural-note positions on a string within a fret range.
 * Beginners read natural notes first (Sagreras, Sor and Aguado all introduce
 * open strings and first-position naturals before accidentals).
 */
function naturalPositions(string: number, minFret: number, maxFret: number): Position[] {
  const out: Position[] = [];
  for (let fret = minFret; fret <= maxFret; fret++) {
    const note = midiToNote(positionToMidi({ string, fret }));
    if (isNatural(note)) {
      out.push({ string, fret });
    }
  }
  return out;
}

function combine(...groups: Position[][]): Position[] {
  return groups.flat();
}

/**
 * Progressive curriculum inspired by the pedagogical sequence of the classical
 * methods (Sagreras "Las primeras lecciones", Sor and Aguado): start on a
 * single string in first position, consolidate, then add strings and finally
 * the bass strings. All exercises use ORIGINAL note sequences, not copyrighted
 * works.
 */
const string1 = naturalPositions(1, 0, 3); // E5, F5, G5
const string2 = naturalPositions(2, 0, 3); // B4, C5, D5
const string3 = naturalPositions(3, 0, 4); // G4, A4, B4
const string4 = naturalPositions(4, 0, 3); // D4, E4, F4
const string5 = naturalPositions(5, 0, 3); // A3, B3, C4
const string6 = naturalPositions(6, 0, 3); // E3, F3, G3

export const LEVELS: Level[] = [
  {
    id: 'l1-string1',
    order: 1,
    name: '1.ª cuerda (Mi)',
    description: 'Notas naturales en la cuerda más aguda: Mi, Fa, Sol.',
    strings: [1],
    maxFret: 3,
    positions: string1,
    questionsPerRound: 8,
  },
  {
    id: 'l2-string2',
    order: 2,
    name: '2.ª cuerda (Si)',
    description: 'Notas naturales en la segunda cuerda: Si, Do, Re.',
    strings: [2],
    maxFret: 3,
    positions: string2,
    questionsPerRound: 8,
  },
  {
    id: 'l3-strings12',
    order: 3,
    name: 'Cuerdas 1 y 2',
    description: 'Combina las dos primeras cuerdas y distingue su altura.',
    strings: [1, 2],
    maxFret: 3,
    positions: combine(string1, string2),
    questionsPerRound: 10,
  },
  {
    id: 'l4-string3',
    order: 4,
    name: '3.ª cuerda (Sol)',
    description: 'Notas naturales en la tercera cuerda: Sol, La, Si.',
    strings: [3],
    maxFret: 4,
    positions: string3,
    questionsPerRound: 8,
  },
  {
    id: 'l5-strings123',
    order: 5,
    name: 'Cuerdas agudas (1-2-3)',
    description: 'Lectura en las tres cuerdas agudas en primera posición.',
    strings: [1, 2, 3],
    maxFret: 4,
    positions: combine(string1, string2, string3),
    questionsPerRound: 12,
  },
  {
    id: 'l6-string4',
    order: 6,
    name: '4.ª cuerda (Re)',
    description: 'Notas naturales en la cuarta cuerda: Re, Mi, Fa.',
    strings: [4],
    maxFret: 3,
    positions: string4,
    questionsPerRound: 8,
  },
  {
    id: 'l7-string5',
    order: 7,
    name: '5.ª cuerda (La)',
    description: 'Notas naturales en la quinta cuerda: La, Si, Do.',
    strings: [5],
    maxFret: 3,
    positions: string5,
    questionsPerRound: 8,
  },
  {
    id: 'l8-string6',
    order: 8,
    name: '6.ª cuerda (Mi)',
    description: 'Notas naturales en la cuerda más grave: Mi, Fa, Sol.',
    strings: [6],
    maxFret: 3,
    positions: string6,
    questionsPerRound: 8,
  },
  {
    id: 'l9-bass',
    order: 9,
    name: 'Cuerdas graves (4-5-6)',
    description: 'Lectura de las notas graves bajo el pentagrama.',
    strings: [4, 5, 6],
    maxFret: 3,
    positions: combine(string4, string5, string6),
    questionsPerRound: 12,
  },
  {
    id: 'l10-all',
    order: 10,
    name: 'Primera posición completa',
    description: 'Repaso final: todas las cuerdas en primera posición.',
    strings: [1, 2, 3, 4, 5, 6],
    maxFret: 4,
    positions: combine(string1, string2, string3, string4, string5, string6),
    questionsPerRound: 15,
  },
];

export function getLevel(id: string): Level | undefined {
  return LEVELS.find((l) => l.id === id);
}

export function getLevelByOrder(order: number): Level | undefined {
  return LEVELS.find((l) => l.order === order);
}
