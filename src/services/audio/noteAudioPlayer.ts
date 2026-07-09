import { Position } from '../../domain/fretboard';
import {
  FeedbackSound,
  getFeedbackAudioRelativePath,
  getPositionAudioRelativePath,
} from './noteAudioCatalog';

type AnyObject = Record<string, unknown>;

interface RuntimeAudioPlayer {
  replace: (source: AnyObject) => void;
  play: () => void;
  pause: () => void;
  remove: () => void;
}

function getExpoAudioModule():
  | {
      createAudioPlayer?: (source: AnyObject) => RuntimeAudioPlayer;
    }
  | null {
  try {
    return require('expo-audio');
  } catch {
    return null;
  }
}

function warnOnceFactory() {
  const seen = new Set<string>();
  return (key: string, error?: unknown) => {
    if (seen.has(key)) return;
    seen.add(key);
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.warn(`[AudioService] ${key}`, error);
    }
  };
}

const warnOnce = warnOnceFactory();

export interface NoteAudioPlayer {
  preloadPositions: (positions: Position[]) => Promise<void>;
  playPosition: (position: Position) => Promise<void>;
  playFeedback: (kind: FeedbackSound) => Promise<void>;
  stop: () => Promise<void>;
  release: () => Promise<void>;
}

class ExpoNoteAudioPlayer implements NoteAudioPlayer {
  private readonly expoAudio = getExpoAudioModule();
  private activePlayer: RuntimeAudioPlayer | null = null;
  private preloadCache = new Set<string>();

  private createPlayer(uri: string): RuntimeAudioPlayer | null {
    const createAudioPlayer = this.expoAudio?.createAudioPlayer;
    if (!createAudioPlayer) {
      warnOnce('expo-audio createAudioPlayer unavailable');
      return null;
    }
    try {
      return createAudioPlayer({ uri });
    } catch (error) {
      warnOnce(`failed to create player for ${uri}`, error);
      return null;
    }
  }

  private async playUri(uri: string): Promise<void> {
    const player = this.createPlayer(uri);
    if (!player) return;
    try {
      await this.stop();
      this.activePlayer = player;
      player.play();
    } catch (error) {
      warnOnce(`failed to play ${uri}`, error);
    }
  }

  async preloadPositions(positions: Position[]): Promise<void> {
    for (const position of positions) {
      const uri = getPositionAudioRelativePath(position);
      if (this.preloadCache.has(uri)) continue;
      this.preloadCache.add(uri);
      const player = this.createPlayer(uri);
      if (!player) continue;
      try {
        player.pause();
        player.remove();
      } catch (error) {
        warnOnce(`failed to preload ${uri}`, error);
      }
    }
  }

  async playPosition(position: Position): Promise<void> {
    await this.playUri(getPositionAudioRelativePath(position));
  }

  async playFeedback(kind: FeedbackSound): Promise<void> {
    await this.playUri(getFeedbackAudioRelativePath(kind));
  }

  async stop(): Promise<void> {
    if (!this.activePlayer) return;
    try {
      this.activePlayer.pause();
      this.activePlayer.remove();
    } catch (error) {
      warnOnce('failed to stop active sound', error);
    } finally {
      this.activePlayer = null;
    }
  }

  async release(): Promise<void> {
    await this.stop();
    this.preloadCache.clear();
  }
}

export const noteAudioPlayer: NoteAudioPlayer = new ExpoNoteAudioPlayer();
