import { Position, positionToMidi } from '../../../domain/fretboard';
import { staffStepFromMidi } from '../../../domain/staff';

export interface Stage1Position {
  noteLabel: string;
  string: number;
  fret: number;
  midi: number;
  staffPosition: number;
}

/** Canonical first-position naturals for Stage 1 (pedagogical labels). */
const STAGE1_POSITION_ENTRIES: Array<{ noteLabel: string; string: number; fret: number }> = [
  { noteLabel: 'E4', string: 1, fret: 0 },
  { noteLabel: 'F4', string: 1, fret: 1 },
  { noteLabel: 'G4', string: 1, fret: 3 },
  { noteLabel: 'B3', string: 2, fret: 0 },
  { noteLabel: 'C4', string: 2, fret: 1 },
  { noteLabel: 'D4', string: 2, fret: 3 },
  { noteLabel: 'G3', string: 3, fret: 0 },
  { noteLabel: 'A3', string: 3, fret: 2 },
  { noteLabel: 'D3', string: 4, fret: 0 },
  { noteLabel: 'E3', string: 4, fret: 2 },
  { noteLabel: 'F3', string: 4, fret: 3 },
  { noteLabel: 'A2', string: 5, fret: 0 },
  { noteLabel: 'B2', string: 5, fret: 2 },
  { noteLabel: 'C3', string: 5, fret: 3 },
  { noteLabel: 'E2', string: 6, fret: 0 },
  { noteLabel: 'F2', string: 6, fret: 1 },
  { noteLabel: 'G2', string: 6, fret: 3 },
];

function toStage1Position(entry: { noteLabel: string; string: number; fret: number }): Stage1Position {
  const position: Position = { string: entry.string, fret: entry.fret };
  const midi = positionToMidi(position);
  return {
    ...entry,
    midi,
    staffPosition: staffStepFromMidi(midi),
  };
}

export const STAGE1_ALL_POSITIONS: Stage1Position[] = STAGE1_POSITION_ENTRIES.map(toStage1Position);

const BY_LABEL = new Map(STAGE1_ALL_POSITIONS.map((p) => [p.noteLabel, p]));
const BY_POSITION = new Map(
  STAGE1_ALL_POSITIONS.map((p) => [`${p.string}:${p.fret}`, p])
);

export const STAGE1_BLOCK_NOTES: Record<string, string[]> = {
  'stage1-block0': [],
  'stage1-block1': ['E4', 'F4', 'G4'],
  'stage1-block2': ['B3', 'C4', 'D4'],
  'stage1-block3': ['E4', 'F4', 'G4', 'B3', 'C4', 'D4'],
  'stage1-block4': ['G3', 'A3'],
  'stage1-block5': ['E4', 'F4', 'G4', 'B3', 'C4', 'D4', 'G3', 'A3'],
  'stage1-block6': ['D3', 'E3', 'F3'],
  'stage1-block7': ['E4', 'F4', 'G4', 'B3', 'C4', 'D4', 'G3', 'A3', 'D3', 'E3', 'F3', 'A2', 'B2', 'C3'],
  'stage1-block8': ['E2', 'F2', 'G2'],
  'stage1-block9': STAGE1_ALL_POSITIONS.map((p) => p.noteLabel),
};

export function getStage1Position(noteLabel: string): Stage1Position | undefined {
  return BY_LABEL.get(noteLabel);
}

export function getStage1PositionByCoords(string: number, fret: number): Stage1Position | undefined {
  return BY_POSITION.get(`${string}:${fret}`);
}

export function getStage1PositionsForNotes(noteLabels: string[]): Stage1Position[] {
  return noteLabels
    .map((label) => getStage1Position(label))
    .filter((p): p is Stage1Position => Boolean(p));
}

export function getStage1PositionsForBlock(blockId: string): Stage1Position[] {
  const notes = STAGE1_BLOCK_NOTES[blockId] ?? [];
  return getStage1PositionsForNotes(notes);
}

export function isValidStage1Position(string: number, fret: number): boolean {
  return BY_POSITION.has(`${string}:${fret}`);
}

export function stage1PositionToCoords(pos: Stage1Position): Position {
  return { string: pos.string, fret: pos.fret };
}
