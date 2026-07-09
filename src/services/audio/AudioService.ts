import { Position } from '../../domain/fretboard';
import { useSettingsStore } from '../../settings/store';
import { noteAudioPlayer } from './noteAudioPlayer';

class AudioService {
  async preloadSession(positions: Position[]): Promise<void> {
    const { soundEnabled } = useSettingsStore.getState();
    if (!soundEnabled) return;
    await noteAudioPlayer.preloadPositions(positions);
  }

  async playPosition(position: Position): Promise<void> {
    const { soundEnabled } = useSettingsStore.getState();
    if (!soundEnabled) return;
    await noteAudioPlayer.playPosition(position);
  }

  async playCorrectForAnswer(position: Position): Promise<void> {
    const { soundEnabled, playCorrectNoteAfterAnswer } = useSettingsStore.getState();
    if (!soundEnabled || !playCorrectNoteAfterAnswer) return;
    await noteAudioPlayer.playPosition(position);
  }

  async playFeedback(isCorrect: boolean): Promise<void> {
    const { soundEnabled, feedbackSoundsEnabled } = useSettingsStore.getState();
    if (!soundEnabled || !feedbackSoundsEnabled) return;
    await noteAudioPlayer.playFeedback(isCorrect ? 'correct' : 'wrong');
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
