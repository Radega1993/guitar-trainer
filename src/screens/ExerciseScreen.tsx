import React, { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import PrimaryButton from '../components/common/PrimaryButton';
import ScrollingStaffTrainer from '../components/staff/ScrollingStaffTrainer';
import StaticFretboardTrainer from '../components/staff/StaticFretboardTrainer';
import { getLevel } from '../data/levels';
import { getStudyLevelById } from '../data/curriculum';
import { getScoringOptionsForStudyLevel } from '../data/curriculum/scoringOptions';
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
import { TrainerSpeed } from '../engine/scrollingTimeline';

type Props = NativeStackScreenProps<RootStackParamList, 'Exercise'>;

export default function ExerciseScreen({ route, navigation }: Props) {
  const mode = route.params.sessionMode ?? 'level';
  const sourceId = route.params.sourceId ?? route.params.levelId ?? 'l1-string1';
  const studyLevel = route.params.studyLevelId
    ? getStudyLevelById(route.params.studyLevelId)
    : undefined;

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
  const { recordRound, recordStudyLevelResult, recordBlockExamResult, isStudyLevelUnlocked } =
    useProgress();

  const round = useRef<Question[]>(session.questions).current;
  const startTime = useRef<number>(Date.now());
  const roundId = useRef<string>(makeEventId('round')).current;
  const [activeIndex, setActiveIndex] = useState(0);
  const progressPct = useMemo(
    () => (round.length > 0 ? (activeIndex / round.length) * 100 : 0),
    [activeIndex, round.length]
  );

  const stageType = session.metadata?.stageExerciseType ?? studyLevel?.stageLevelType;
  const useStatic =
    stageType === 'fretboard' || stageType === 'speed' || (!stageType && mode === 'level' && !studyLevel);
  const scrollSpeed: TrainerSpeed =
    studyLevel?.stageConfig?.animationSpeed ??
    (mode === 'infinite'
      ? sourceId === 'slow' || sourceId === 'fast'
        ? sourceId
        : 'normal'
      : (level?.order ?? 5) <= 3
      ? 'slow'
      : (level?.order ?? 5) <= 6
      ? 'normal'
      : 'fast');

  const maxFret = studyLevel?.stageConfig?.frets.length
    ? Math.max(...studyLevel.stageConfig.frets, 3)
    : level?.maxFret ?? 4;

  useEffect(() => {
    const positions = round.map((q) => q.position);
    void audioService.preloadSession(positions);
    return () => {
      void audioService.release();
    };
  }, [round]);

  const handleComplete = ({
    correctCount,
    total,
    totalTimeMs,
    avgResponseMs,
  }: {
    correctCount: number;
    total: number;
    totalTimeMs: number;
    avgResponseMs: number;
  }) => {
    const endedAt = new Date().toISOString();
    const elapsed = Date.now() - startTime.current;
    const result = summarizeRound(
      correctCount,
      total,
      totalTimeMs || elapsed,
      avgResponseMs,
      getScoringOptionsForStudyLevel(studyLevel)
    );
    if (level?.id) {
      recordRound(level.id, result);
    }
    if (route.params.studyLevelId) {
      recordStudyLevelResult(route.params.studyLevelId, result);
    }
    if (mode === 'block' && sourceId.startsWith('exam:')) {
      recordBlockExamResult(sourceId.replace('exam:', ''), result.accuracy, result.passed);
    }
    void saveRoundEvent({
      id: roundId,
      levelId: level?.id ?? route.params.studyLevelId ?? mode,
      startedAt: new Date(startTime.current).toISOString(),
      endedAt,
      totalQuestions: result.total,
      correctCount: result.correct,
      stars: result.stars,
      durationMs: result.timeMs,
    });
    navigation.replace('Results', {
      levelId: level?.id ?? route.params.studyLevelId ?? 'l1-string1',
      studyLevelId: route.params.studyLevelId,
      result,
      title: studyLevel?.title ?? level?.name,
    });
  };

  const handleResponse = ({
    questionIndex,
    question,
    selected,
    isCorrect,
    responseTimeMs,
  }: {
    questionIndex: number;
    question: Question;
    selected: { string: number; fret: number };
    isCorrect: boolean;
    responseTimeMs: number;
  }) => {
    void saveResponseEvent({
      id: makeEventId('resp'),
      roundId,
      questionIndex,
      levelId: level?.id ?? route.params.studyLevelId ?? mode,
      targetNote: noteNameEn(question.note, true),
      targetString: question.position.string,
      targetFret: question.position.fret,
      selectedString: selected.string,
      selectedFret: selected.fret,
      isCorrect,
      responseTimeMs,
      createdAt: new Date().toISOString(),
    });
  };

  const title =
    studyLevel?.title ??
    (mode === 'level' ? level?.name ?? 'Ejercicio' : mode === 'block' ? 'Bloque de estudio' : 'Práctica infinita');

  if (route.params.studyLevelId && !isStudyLevelUnlocked(route.params.studyLevelId)) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.levelName}>Lección bloqueada</Text>
        <PrimaryButton label="Volver" onPress={() => navigation.goBack()} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <View style={styles.header}>
        <Text style={styles.levelName}>{title}</Text>
        <Text style={styles.counter}>
          {Math.min(activeIndex + 1, round.length)} / {round.length}
        </Text>
      </View>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progressPct}%` }]} />
      </View>

      {useStatic ? (
        <StaticFretboardTrainer
          questions={round}
          maxFret={maxFret}
          onActiveIndexChange={setActiveIndex}
          onResponse={handleResponse}
          onComplete={handleComplete}
        />
      ) : (
        <ScrollingStaffTrainer
          questions={round}
          speed={scrollSpeed}
          previewNotes={4}
          spacingBetweenNotes={62}
          autoStart
          pauseOnWrongAnswer={false}
          showTargetZone
          lockFretboardWhileMoving
          onActiveIndexChange={setActiveIndex}
          onResponse={handleResponse}
          onComplete={handleComplete}
        />
      )}
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
