import { Position } from '../../domain/fretboard';

export type FeedbackSound = 'correct' | 'wrong' | 'tap';

const NOTE_AUDIO_FOLDER = '/assets/audio/notes';
const FEEDBACK_AUDIO_FOLDER = '/assets/audio/feedback';

export function positionToAudioKey(position: Position): string {
  return `c${position.string}t${position.fret}`;
}

export function getPositionAudioRelativePath(position: Position): string {
  return `${NOTE_AUDIO_FOLDER}/${positionToAudioKey(position)}.mp3`;
}

export function getFeedbackAudioRelativePath(kind: FeedbackSound): string {
  return `${FEEDBACK_AUDIO_FOLDER}/${kind}.mp3`;
}

/**
 * Build all expected keys for a given range, useful for preload.
 */
export function listPositionAudioKeys(maxFret = 12): string[] {
  const out: string[] = [];
  for (let string = 1; string <= 6; string += 1) {
    for (let fret = 0; fret <= maxFret; fret += 1) {
      out.push(`c${string}t${fret}`);
    }
  }
  return out;
}
