import React, { useMemo, useRef, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PrimaryButton from '../components/common/PrimaryButton';
import ScrollingStaffTrainer from '../components/staff/ScrollingStaffTrainer';
import PracticeLiveStatsBar from '../components/practice/PracticeLiveStatsBar';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { buildInfiniteBatch } from '../engine/infiniteGenerator';
import { createPracticeSessionState, reducePracticeAnswer } from '../engine/practiceSession';
import { buildPracticeSummary } from '../analytics/practiceSummary';
import { colors, spacing } from '../theme';
import { makeEventId, saveResponseEvent, saveRoundEvent } from '../storage/sqlite/eventsRepository';

type Props = NativeStackScreenProps<RootStackParamList, 'PracticeSession'>;

export default function PracticeSessionScreen({ route, navigation }: Props) {
  const { config } = route.params;
  const [state, setState] = useState(() => createPracticeSessionState());
  const [paused, setPaused] = useState(false);
  const [batchIndex, setBatchIndex] = useState(0);
  const roundId = useRef(makeEventId('practice_round')).current;

  const batch = useMemo(
    () =>
      buildInfiniteBatch(
        config,
        state.failedPositions,
        state.failedPositions[state.failedPositions.length - 1]
      ),
    [config, batchIndex]
  );

  const stopSession = async () => {
    const summary = buildPracticeSummary(state);
    if (config.saveStatsOnStop) {
      await saveRoundEvent({
        id: roundId,
        levelId: 'practice-infinite',
        sessionMode: 'practice',
        sessionSource: 'practice-setup',
        startedAt: new Date(state.startedAt).toISOString(),
        endedAt: new Date().toISOString(),
        totalQuestions: state.stats.attempts,
        correctCount: state.stats.correct,
        stars: 0,
        durationMs: state.elapsedMs,
      });
    }
    navigation.replace('PracticeSummary', { summary });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <View style={styles.content}>
        <PracticeLiveStatsBar stats={state.stats} />
        <View style={styles.controls}>
          <PrimaryButton
            label={paused ? 'Reanudar' : 'Pausar'}
            variant="secondary"
            onPress={() => setPaused((v) => !v)}
            style={styles.controlBtn}
          />
          <PrimaryButton
            label="Parar"
            variant="secondary"
            onPress={() =>
              Alert.alert('Finalizar práctica', '¿Quieres detener la sesión?', [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Parar', style: 'destructive', onPress: () => void stopSession() },
              ])
            }
            style={styles.controlBtn}
          />
        </View>
        {!paused ? (
          <ScrollingStaffTrainer
            key={`practice-${batchIndex}`}
            questions={batch}
            speed={config.speed}
            autoStart
            pauseOnWrongAnswer={false}
            requireCorrectToAdvance
            hintAfterErrors={3}
            showTargetZone={config.animated}
            lockFretboardWhileMoving={config.animated}
            onResponse={({ questionIndex, question, selected, isCorrect, responseTimeMs }) => {
              setState((prev) =>
                reducePracticeAnswer(prev, {
                  isCorrect,
                  responseTimeMs,
                  position: question.position,
                })
              );
              if (config.saveStatsOnStop) {
                void saveResponseEvent({
                  id: makeEventId('practice_resp'),
                  roundId,
                  questionIndex,
                  levelId: 'practice-infinite',
                  sessionMode: 'practice',
                  sessionSource: 'practice-setup',
                  targetNote: `${question.note.letter}${question.note.octave}`,
                  targetString: question.position.string,
                  targetFret: question.position.fret,
                  selectedString: selected.string,
                  selectedFret: selected.fret,
                  isCorrect,
                  responseTimeMs,
                  createdAt: new Date().toISOString(),
                });
              }
            }}
            onComplete={() => {
              if (config.timedMode && state.elapsedMs / 1000 >= config.timeLimitSec) {
                void stopSession();
                return;
              }
              setBatchIndex((v) => v + 1);
            }}
          />
        ) : (
          <View style={styles.paused}>
            <Text style={styles.pausedText}>Sesión en pausa</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, gap: spacing.md },
  controls: { flexDirection: 'row', gap: spacing.sm },
  controlBtn: { flex: 1 },
  paused: { padding: spacing.lg, alignItems: 'center' },
  pausedText: { color: colors.text, fontSize: 18, fontWeight: '700' },
});

