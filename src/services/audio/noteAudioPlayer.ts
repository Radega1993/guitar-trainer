/**
 * Stub player ready to be replaced by expo-av integration.
 * Keeping a stable API now avoids touching exercise screens later.
 */
export interface NoteAudioPlayer {
  play: (americanNoteWithOctave: string) => Promise<void>;
  stop: () => Promise<void>;
  preload: (notes: string[]) => Promise<void>;
}

class NoopNoteAudioPlayer implements NoteAudioPlayer {
  async play(_americanNoteWithOctave: string): Promise<void> {
    // no-op in MVP; real playback will be connected when note recordings are added
  }
  async stop(): Promise<void> {
    // no-op
  }
  async preload(_notes: string[]): Promise<void> {
    // no-op
  }
}

export const noteAudioPlayer: NoteAudioPlayer = new NoopNoteAudioPlayer();
