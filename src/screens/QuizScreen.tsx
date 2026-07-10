import React, { useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import PrimaryButton from '../components/common/PrimaryButton';
import { getStudyLevelById } from '../data/curriculum';
import { getScoringOptionsForStudyLevel } from '../data/curriculum/scoringOptions';
import { summarizeRound } from '../engine/scoring';
import { audioService } from '../services/audio/AudioService';
import { RootStackParamList } from '../navigation/types';
import { useProgress } from '../storage/ProgressContext';
import { colors, radius, spacing } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Quiz'>;

export default function QuizScreen({ route, navigation }: Props) {
  const { studyLevelId } = route.params;
  const studyLevel = getStudyLevelById(studyLevelId);
  const questions = studyLevel?.quizQuestions ?? [];
  const [index, setIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [answering, setAnswering] = useState(false);
  const startTime = useRef(Date.now());
  const responseTimes = useRef<number[]>([]);
  const questionStart = useRef(Date.now());
  const { recordStudyLevelResult, isStudyLevelUnlocked } = useProgress();

  const current = questions[index];

  if (!studyLevel || questions.length === 0) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.prompt}>Quiz no encontrado</Text>
        <PrimaryButton label="Volver" onPress={() => navigation.goBack()} />
      </SafeAreaView>
    );
  }

  if (!isStudyLevelUnlocked(studyLevelId)) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.prompt}>Lección bloqueada</Text>
        <PrimaryButton label="Volver" onPress={() => navigation.goBack()} />
      </SafeAreaView>
    );
  }

  const finish = (finalCorrect: number) => {
    const total = questions.length;
    const elapsed = Date.now() - startTime.current;
    const avg =
      responseTimes.current.length > 0
        ? responseTimes.current.reduce((a, b) => a + b, 0) / responseTimes.current.length
        : elapsed / Math.max(1, total);
    const result = summarizeRound(
      finalCorrect,
      total,
      elapsed,
      avg,
      getScoringOptionsForStudyLevel(studyLevel)
    );
    recordStudyLevelResult(studyLevelId, result);
    navigation.replace('Results', {
      levelId: studyLevelId,
      studyLevelId,
      result,
      title: studyLevel?.title,
    });
  };

  const onSelect = async (optionId: string) => {
    if (!current || answering) return;
    setAnswering(true);
    const isCorrect = optionId === current.correctOptionId;
    responseTimes.current.push(Date.now() - questionStart.current);
    const nextCorrect = correct + (isCorrect ? 1 : 0);
    try {
      await audioService.playFeedback(isCorrect);
      if (index + 1 >= questions.length) {
        finish(nextCorrect);
      } else {
        setCorrect(nextCorrect);
        setIndex((i) => i + 1);
        questionStart.current = Date.now();
        setAnswering(false);
      }
    } catch {
      setAnswering(false);
    }
  };

  if (!current) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.prompt}>Quiz no encontrado</Text>
        <PrimaryButton label="Volver" onPress={() => navigation.goBack()} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <View style={styles.content}>
        <Text style={styles.counter}>
          {index + 1} / {questions.length}
        </Text>
        <Text key={current.id} style={styles.prompt}>
          {current.prompt}
        </Text>
        <View style={styles.options}>
          {current.options.map((opt) => (
            <PrimaryButton
              key={`${current.id}-${opt.id}`}
              label={opt.label}
              variant="secondary"
              disabled={answering}
              onPress={() => void onSelect(opt.id)}
              style={styles.optionBtn}
            />
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background, padding: spacing.lg },
  content: { flex: 1, gap: spacing.lg, justifyContent: 'center' },
  counter: { color: colors.textMuted, fontSize: 14, fontWeight: '600' },
  prompt: { color: colors.text, fontSize: 22, fontWeight: '700', lineHeight: 30 },
  options: { gap: spacing.sm },
  optionBtn: { alignSelf: 'stretch' },
});
