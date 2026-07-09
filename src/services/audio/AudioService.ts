import { Position } from '../../domain/fretboard';
import { useSettingsStore } from '../../settings/store';
import {
  getPositionAudioRelativePath,
  listStage1AudioKeys,
} from './noteAudioCatalog';
import { noteAudioPlayer } from './noteAudioPlayer';

class AudioService {
  async preloadSession(positions: Position[]): Promise<void> {
    const { soundEnabled } = useSettingsStore.getState();
    if (!soundEnabled) return;
    await noteAudioPlayer.preloadPositions(positions);
  }

  async preloadStage1Audios(): Promise<void> {
    const { soundEnabled } = useSettingsStore.getState();
    if (!soundEnabled) return;
    const positions: Position[] = listStage1AudioKeys().map((key) => {
      const match = /^c(\d+)t(\d+)$/.exec(key);
      if (!match) return { string: 1, fret: 0 };
      return { string: Number(match[1]), fret: Number(match[2]) };
    });
    await noteAudioPlayer.preloadPositions(positions);
  }

  async playNoteByPosition(string: number, fret: number): Promise<void> {
    await this.playPosition({ string, fret });
  }

  async playPosition(position: Position): Promise<void> {
    const { soundEnabled } = useSettingsStore.getState();
    if (!soundEnabled) return;
    try {
      await noteAudioPlayer.playPosition(position);
    } catch (err) {
      console.warn(`Missing audio for c${position.string}t${position.fret}`, err);
    }
  }

  async playCorrectFeedback(): Promise<void> {
    await this.playFeedback(true);
  }

  async playWrongFeedback(): Promise<void> {
    await this.playFeedback(false);
  }

  async playCorrectForAnswer(position: Position): Promise<void> {
    const { soundEnabled, playCorrectNoteAfterAnswer } = useSettingsStore.getState();
    if (!soundEnabled || !playCorrectNoteAfterAnswer) return;
    await this.playPosition(position);
  }

  async playFeedback(isCorrect: boolean): Promise<void> {
    const { soundEnabled, feedbackSoundsEnabled } = useSettingsStore.getState();
    if (!soundEnabled || !feedbackSoundsEnabled) return;
    try {
      await noteAudioPlayer.playFeedback(isCorrect ? 'correct' : 'wrong');
    } catch (err) {
      console.warn('Missing feedback audio', err);
    }
  }

  getAudioPathForPosition(position: Position): string {
    return getPositionAudioRelativePath(position);
  }

  async playFretTap(): Promise<void> {
    const { soundEnabled, fretTapSoundEnabled } = useSettingsStore.getState();
    if (!soundEnabled || !fretTapSoundEnabled) return;
    await noteAudioPlayer.playFeedback('tap');
  }

  async stop(): Promise<void> {
    await noteAudioPlayer.stop();
  }

  async release(): Promise<void> {
    await noteAudioPlayer.release();
  }
}

export const audioService = new AudioService();
