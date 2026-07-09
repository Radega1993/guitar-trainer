import { INITIAL_STUDY_BLOCKS } from '../data/curriculum';
import { LEVELS } from '../data/levels';
import { Position, positionToMidi } from '../domain/fretboard';
import { midiToNote } from '../domain/notes';
import { Question } from './exercise';
import { PracticeConfig } from './practiceConfig';

function poolFromConfig(config: PracticeConfig): Position[] {
  const selectedLevelIds = new Set(config.levelIds);
  const selectedLegacyLevelIds = new Set(
    INITIAL_STUDY_BLOCKS.flatMap((b) => (config.blockIds.includes(b.id) ? b.levels.flatMap((l) => l.levelRefIds) : []))
  );

  const candidates = LEVELS.filter((l) => {
    if (selectedLegacyLevelIds.size > 0) return selectedLegacyLevelIds.has(l.id);
    if (selectedLevelIds.size > 0) {
      return INITIAL_STUDY_BLOCKS.flatMap((b) => b.levels).some(
        (sl) => selectedLevelIds.has(sl.id) && sl.levelRefIds.includes(l.id)
      );
    }
    return true;
  }).flatMap((l) => l.positions);

  return candidates.filter((pos) => {
    if (!config.strings.includes(pos.string)) return false;
    if (pos.fret < config.fretMin || pos.fret > config.fretMax) return false;
    if (config.notePool.length === 0) return true;
    return config.notePool.includes(midiToNote(positionToMidi(pos)).letter);
  });
}

export function buildInfiniteBatch(
  config: PracticeConfig,
  failedPool: Position[] = [],
  previous?: Position,
  rng: () => number = Math.random
): Question[] {
  const basePool = config.onlyFailedNotes && failedPool.length > 0 ? failedPool : poolFromConfig(config);
  if (basePool.length === 0) return [];
  const out: Question[] = [];
  let prev = previous;
  for (let i = 0; i < config.batchSize; i++) {
    let candidate = basePool[Math.floor(rng() * basePool.length)];
    let guard = 0;
    while (prev && candidate.string === prev.string && candidate.fret === prev.fret && guard < 8) {
      candidate = basePool[Math.floor(rng() * basePool.length)];
      guard += 1;
    }
    const midi = positionToMidi(candidate);
    out.push({ position: candidate, midi, note: midiToNote(midi) });
    prev = candidate;
  }
  return out;
}

