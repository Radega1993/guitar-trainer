import React, { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import PrimaryButton from '../components/common/PrimaryButton';
import Staff from '../components/staff/Staff';
import { getStudyLevelById } from '../data/curriculum';
import { getScoringOptionsForStudyLevel } from '../data/curriculum/scoringOptions';
import { midiToNote } from '../domain/notes';
import { createStage1LevelSession } from '../services/exercise/sessionService';
import { formatAmericanRawName, formatNoteName } from '../settings/noteFormat';
import { useSettingsStore } from '../settings/store';
import { summarizeRound } from '../engine/scoring';
import { audioService } from '../services/audio/AudioService';
import { RootStackParamList } from '../navigation/types';
import { useProgress } from '../storage/ProgressContext';
import { colors, spacing } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Recognition'>;

function shuffle<T>(items: T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export default function RecognitionScreen({ route, navigation }: Props) {
  const { studyLevelId } = route.params;
  const studyLevel = getStudyLevelById(studyLevelId);
  const notation = useSettingsStore((s) => s.noteNamingSystem);
  const session = useMemo(() => createStage1LevelSession(studyLevelId), [studyLevelId]);
  const [index, setIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const startTime = useRef(Date.now());
  const responseTimes = useRef<number[]>([]);
  const questionStart = useRef(Date.now());
  const { recordStudyLevelResult } = useProgress();

  const question = session.questions[index];

  useEffect(() => {
    if (question) {
      void audioService.preloadSession([question.position]);
      void audioService.playPosition(question.position);
    }
  }, [question]);

  const options = useMemo(() => {
    if (!studyLevel?.stageConfig || !question) return [];
    const pool =
      studyLevel.stageConfig.notes.length > 0
        ? studyLevel.stageConfig.notes.map((n) => formatAmericanRawName(n, notation))
        : session.questions.map((q) => formatNoteName(q.note, notation));
    const unique = Array.from(new Set(pool));
    const correctLabel = formatNoteName(question.note, notation);
    const distractors = unique.filter((n) => n !== correctLabel);
    const picks = shuffle(distractors).slice(0, Math.min(3, distractors.length));
    return shuffle([correctLabel, ...picks]);
  }, [studyLevel, question, session.questions, notation]);

  const finish = (finalCorrect: number) => {
    const total = session.questions.length;
    const elapsed = Date.now() - startTime.current;
    const avg =
      responseTimes.current.reduce((a, b) => a + b, 0) / Math.max(1, responseTimes.current.length);
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

  const onSelect = async (label: string) => {
    if (!question) return;
    const correctLabel = formatNoteName(question.note, notation);
    const isCorrect = label === correctLabel;
    responseTimes.current.push(Date.now() - questionStart.current);
    await audioService.playFeedback(isCorrect);
    const nextCorrect = correct + (isCorrect ? 1 : 0);
    if (index + 1 >= session.questions.length) {
      finish(nextCorrect);
    } else {
      setCorrect(nextCorrect);
      setIndex((i) => i + 1);
      questionStart.current = Date.now();
    }
  };

  if (!studyLevel || !question) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text>Ejercicio no encontrado</Text>
        <PrimaryButton label="Volver" onPress={() => navigation.goBack()} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <View style={styles.header}>
        <Text style={styles.title}>{studyLevel.title}</Text>
        <Text style={styles.counter}>
          {index + 1} / {session.questions.length}
        </Text>
      </View>
      <Staff note={midiToNote(question.midi)} height={200} />
      <Text style={styles.prompt}>¿Cómo se llama esta nota?</Text>
      <View style={styles.options}>
        {options.map((label) => (
          <PrimaryButton
            key={label}
            label={label}
            variant="secondary"
            onPress={() => void onSelect(label)}
            style={styles.optionBtn}
          />
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background, padding: spacing.lg, gap: spacing.md },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { color: colors.text, fontSize: 16, fontWeight: '700' },
  counter: { color: colors.textMuted, fontSize: 14 },
  prompt: { color: colors.text, fontSize: 18, fontWeight: '600', textAlign: 'center' },
  options: { gap: spacing.sm, marginTop: spacing.md },
  optionBtn: { alignSelf: 'stretch' },
});
