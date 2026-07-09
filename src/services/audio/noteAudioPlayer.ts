import { Position } from '../../domain/fretboard';
import { FeedbackSound } from './noteAudioCatalog';
import {
  getFeedbackAudioModule,
  getNoteAudioModule,
} from './noteAudioAssets';
import { positionToAudioKey } from './noteAudioCatalog';

type AudioSource = number | { uri: string };

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

  private createPlayer(source: AudioSource): RuntimeAudioPlayer | null {
    const createAudioPlayer = this.expoAudio?.createAudioPlayer;
    if (!createAudioPlayer) {
      warnOnce('expo-audio createAudioPlayer unavailable');
      return null;
    }
    try {
      return createAudioPlayer(source as AnyObject);
    } catch (error) {
      warnOnce(`failed to create player`, error);
      return null;
    }
  }

  private cacheKey(source: AudioSource): string {
    return typeof source === 'number' ? `mod:${source}` : source.uri;
  }

  private async playSource(source: AudioSource): Promise<void> {
    const player = this.createPlayer(source);
    if (!player) return;
    try {
      await this.stop();
      this.activePlayer = player;
      player.play();
    } catch (error) {
      warnOnce('failed to play audio', error);
    }
  }

  async preloadPositions(positions: Position[]): Promise<void> {
    for (const position of positions) {
      const key = positionToAudioKey(position);
      const moduleId = getNoteAudioModule(key);
      if (moduleId == null) {
        warnOnce(`missing audio module for ${key}`);
        continue;
      }
      const cacheKey = this.cacheKey(moduleId);
      if (this.preloadCache.has(cacheKey)) continue;
      this.preloadCache.add(cacheKey);
      const player = this.createPlayer(moduleId);
      if (!player) continue;
      try {
        player.pause();
        player.remove();
      } catch (error) {
        warnOnce(`failed to preload ${key}`, error);
      }
    }
  }

  async playPosition(position: Position): Promise<void> {
    const key = positionToAudioKey(position);
    const moduleId = getNoteAudioModule(key);
    if (moduleId == null) {
      warnOnce(`missing audio module for ${key}`);
      return;
    }
    await this.playSource(moduleId);
  }

  async playFeedback(kind: FeedbackSound): Promise<void> {
    await this.playSource(getFeedbackAudioModule(kind));
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
