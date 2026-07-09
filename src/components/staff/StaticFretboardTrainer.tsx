import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Question, isCorrect } from '../../engine/exercise';
import Staff from '../staff/Staff';
import Fretboard, { MarkerStatus } from '../fretboard/Fretboard';
import ExerciseFeedback from '../common/ExerciseFeedback';
import { Position } from '../../domain/fretboard';
import { audioService } from '../../services/audio/AudioService';
import { colors, spacing } from '../../theme';

export interface StaticFretboardTrainerProps {
  questions: Question[];
  maxFret?: number;
  onResponse?: (payload: {
    questionIndex: number;
    question: Question;
    selected: Position;
    isCorrect: boolean;
    responseTimeMs: number;
  }) => void;
  onComplete: (payload: {
    correctCount: number;
    total: number;
    totalTimeMs: number;
    avgResponseMs: number;
  }) => void;
  onActiveIndexChange?: (index: number) => void;
}

const FEEDBACK_MS = 800;

export default function StaticFretboardTrainer({
  questions,
  maxFret = 4,
  onResponse,
  onComplete,
  onActiveIndexChange,
}: StaticFretboardTrainerProps) {
  const [index, setIndex] = useState(0);
  const [marker, setMarker] = useState<{ position: Position; status: MarkerStatus } | null>(null);
  const [feedback, setFeedback] = useState<{ ok: boolean; message: string } | null>(null);
  const [disabled, setDisabled] = useState(false);
  const startRef = React.useRef(Date.now());
  const questionStartRef = React.useRef(Date.now());
  const responseTimesRef = React.useRef<number[]>([]);
  const correctCountRef = React.useRef(0);

  const question = questions[index];

  useEffect(() => {
    onActiveIndexChange?.(index);
    if (question) {
      void audioService.preloadSession([question.position]);
      void audioService.playPosition(question.position);
      questionStartRef.current = Date.now();
      setMarker(null);
      setFeedback(null);
      setDisabled(false);
    }
  }, [index, question, onActiveIndexChange]);

  const advance = useCallback(
    (nextCorrect: number) => {
      if (index + 1 >= questions.length) {
        const totalTime = Date.now() - startRef.current;
        const avg =
          responseTimesRef.current.reduce((a, b) => a + b, 0) /
          Math.max(1, responseTimesRef.current.length);
        onComplete({
          correctCount: nextCorrect,
          total: questions.length,
          totalTimeMs: totalTime,
          avgResponseMs: avg,
        });
      } else {
        setIndex((i) => i + 1);
      }
    },
    [index, onComplete, questions.length]
  );

  const onSelect = async (pos: Position) => {
    if (!question || disabled) return;
    const ok = isCorrect(question, pos);
    const responseTimeMs = Date.now() - questionStartRef.current;
    responseTimesRef.current.push(responseTimeMs);
    setDisabled(true);
    setMarker({ position: pos, status: ok ? 'correct' : 'wrong' });
    setFeedback({ ok, message: ok ? '¡Correcto!' : 'Incorrecto' });
    onResponse?.({ questionIndex: index, question, selected: pos, isCorrect: ok, responseTimeMs });
    await audioService.playFeedback(ok);
    if (ok) {
      await audioService.playCorrectForAnswer(question.position);
    }
    setTimeout(() => {
      if (ok) correctCountRef.current += 1;
      advance(correctCountRef.current);
    }, FEEDBACK_MS);
  };

  if (!question) return null;

  return (
    <View style={styles.wrap}>
      <Staff note={question.note} height={180} />
      <Fretboard
        displayFrets={maxFret}
        onSelect={(pos) => void onSelect(pos)}
        marker={marker}
        highlightString={question.position.string}
        disabled={disabled}
      />
      {feedback ? <ExerciseFeedback visible ok={feedback.ok} message={feedback.message} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, gap: spacing.md },
});
