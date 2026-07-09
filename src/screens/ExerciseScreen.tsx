import React, { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ScrollingStaffTrainer from '../components/staff/ScrollingStaffTrainer';
import { getLevel } from '../data/levels';
import { Question } from '../engine/exercise';
import { summarizeRound } from '../engine/scoring';
import { noteNameEn } from '../domain/notes';
import {
  createBlockExamSession,
  createInfiniteSession,
  createLevelSession,
  createMiniStudySession,
  createStudyLevelSession,
  createStudyBlockSession,
} from '../services/exercise/sessionService';
import { useProgress } from '../storage/ProgressContext';
import {
  makeEventId,
  saveResponseEvent,
  saveRoundEvent,
} from '../storage/sqlite/eventsRepository';
import { audioService } from '../services/audio/AudioService';
import { colors, radius, spacing } from '../theme';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Exercise'>;

export default function ExerciseScreen({ route, navigation }: Props) {
  const mode = route.params.sessionMode ?? 'level';
  const sourceId = route.params.sourceId ?? route.params.levelId ?? 'l1-string1';
  const session = useMemo(() => {
    if (mode === 'block' && sourceId.startsWith('exam:')) {
      return createBlockExamSession(sourceId.replace('exam:', ''));
    }
    if (mode === 'level' && route.params.studyLevelId) {
      return createStudyLevelSession(route.params.studyLevelId, route.params.exerciseConfigId);
    }
    if (mode === 'level' && sourceId.startsWith('mini:')) {
      return createMiniStudySession(sourceId.replace('mini:', ''));
    }
    if (mode === 'block') return createStudyBlockSession(sourceId);
    if (mode === 'infinite') {
      return createInfiniteSession({ totalQuestions: 20, maxFret: 5 });
    }
    return createLevelSession(sourceId);
  }, [mode, route.params.exerciseConfigId, route.params.studyLevelId, sourceId]);
  const level = getLevel(route.params.levelId ?? sourceId);
  const { recordRound, recordStudyLevelResult, recordBlockExamResult } = useProgress();

  const round = useRef<Question[]>(session.questions).current;
  const startTime = useRef<number>(Date.now());
  const totalResponseMs = useRef<number>(0);
  const roundId = useRef<string>(makeEventId('round')).current;
  const [activeIndex, setActiveIndex] = useState(0);
  const progressPct = useMemo(
    () => (round.length > 0 ? (activeIndex / round.length) * 100 : 0),
    [activeIndex, round.length]
  );

  useEffect(() => {
    const positions = round.map((q) => q.position);
    void audioService.preloadSession(positions);
    return () => {
      void audioService.release();
    };
  }, [round]);

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <View style={styles.header}>
        <Text style={styles.levelName}>
          {mode === 'level'
            ? level?.name ?? 'Ejercicio'
            : mode === 'block'
            ? 'Bloque de estudio'
            : 'Práctica infinita'}
        </Text>
        <Text style={styles.counter}>
          {Math.min(activeIndex + 1, round.length)} / {round.length}
        </Text>
      </View>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progressPct}%` }]} />
      </View>

      <ScrollingStaffTrainer
        questions={round}
        speed={
          mode === 'infinite'
            ? sourceId === 'slow' || sourceId === 'fast'
              ? sourceId
              : 'normal'
            : (level?.order ?? 5) <= 3
            ? 'slow'
            : (level?.order ?? 5) <= 6
            ? 'normal'
            : 'fast'
        }
        previewNotes={4}
        spacingBetweenNotes={62}
        autoStart
        pauseOnWrongAnswer={false}
        showTargetZone
        lockFretboardWhileMoving
        onActiveIndexChange={setActiveIndex}
        onResponse={({ questionIndex, question, selected, isCorrect, responseTimeMs }) => {
          totalResponseMs.current += responseTimeMs;
          void saveResponseEvent({
            id: makeEventId('resp'),
            roundId,
            questionIndex,
            levelId: level?.id ?? mode,
            targetNote: noteNameEn(question.note, true),
            targetString: question.position.string,
            targetFret: question.position.fret,
            selectedString: selected.string,
            selectedFret: selected.fret,
            isCorrect,
            responseTimeMs,
            createdAt: new Date().toISOString(),
          });
        }}
        onComplete={({ correctCount, total, totalTimeMs, avgResponseMs }) => {
          const endedAt = new Date().toISOString();
          const elapsed = Date.now() - startTime.current;
          const result = summarizeRound(correctCount, total, totalTimeMs || elapsed, avgResponseMs);
          if (level?.id) {
            recordRound(level.id, result);
          }
          if (route.params.studyLevelId) {
            recordStudyLevelResult(route.params.studyLevelId, result);
          }
          if (mode === 'block' && sourceId.startsWith('exam:')) {
            recordBlockExamResult(sourceId.replace('exam:', ''), result.accuracy, result.stars >= 2);
          }
          void saveRoundEvent({
            id: roundId,
            levelId: level?.id ?? mode,
            startedAt: new Date(startTime.current).toISOString(),
            endedAt,
            totalQuestions: result.total,
            correctCount: result.correct,
            stars: result.stars,
            durationMs: result.timeMs,
          });
          navigation.replace('Results', { levelId: level?.id ?? 'l1-string1', result });
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.sm,
  },
  levelName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  counter: {
    color: colors.textMuted,
    fontSize: 15,
    fontWeight: '600',
  },
  progressTrack: {
    height: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceAlt,
    marginTop: spacing.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: radius.pill,
  },
});
