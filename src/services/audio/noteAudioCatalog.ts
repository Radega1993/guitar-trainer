/**
 * Audio-ready layer for note-by-note recordings.
 * Keep file naming as `assets/audio/notes/<AMERICAN_NOTE>.mp3`, e.g. `G4.mp3`.
 * This catalog currently returns URI strings and can be wired to expo-av later.
 */
export function getNoteAudioRelativePath(americanNoteWithOctave: string): string {
  return `assets/audio/notes/${americanNoteWithOctave}.mp3`;
}
