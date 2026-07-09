import React, { useMemo, useState } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import LevelCompleteCelebration from '../components/celebration/LevelCompleteCelebration';
import PrimaryButton from '../components/common/PrimaryButton';
import TheoryIllustration from '../components/theory/TheoryIllustration';
import { getStudyLevelById } from '../data/curriculum';
import { getScoringOptionsForStudyLevel } from '../data/curriculum/scoringOptions';
import { resolveNextLessonAfterCompleting } from '../data/curriculum/pathNavigation';
import { getStage1TheoryById } from '../data/curriculum/stage1';
import { summarizeRound } from '../engine/scoring';
import { RootStackParamList } from '../navigation/types';
import { useProgress } from '../storage/ProgressContext';
import { colors, radius, spacing } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'TheoryLesson'>;

function PageDots({ total, current }: { total: number; current: number }) {
  return (
    <View style={styles.dots}>
      {Array.from({ length: total }, (_, i) => (
        <View key={i} style={[styles.dot, i === current ? styles.dotActive : styles.dotIdle]} />
      ))}
    </View>
  );
}

export default function TheoryLessonScreen({ route, navigation }: Props) {
  const { studyLevelId } = route.params;
  const studyLevel = getStudyLevelById(studyLevelId);
  const theory = useMemo(
    () => (studyLevel?.stageTheoryId ? getStage1TheoryById(studyLevel.stageTheoryId) : undefined),
    [studyLevel?.stageTheoryId]
  );
  const [pageIndex, setPageIndex] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const { recordStudyLevelResult, state } = useProgress();

  const [celebrationStars, setCelebrationStars] = useState(3);

  const nextLesson = useMemo(
    () => (showCelebration ? resolveNextLessonAfterCompleting(studyLevelId, state) : null),
    [showCelebration, studyLevelId, state]
  );

  if (!studyLevel || !theory) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.title}>Lección no encontrada</Text>
        <PrimaryButton label="Volver" onPress={() => navigation.goBack()} />
      </SafeAreaView>
    );
  }

  const page = theory.pages[pageIndex];
  const isLast = pageIndex >= theory.pages.length - 1;

  const finish = () => {
    const result = summarizeRound(1, 1, 0, 0, getScoringOptionsForStudyLevel(studyLevel));
    recordStudyLevelResult(studyLevelId, { ...result, passed: true });
    setCelebrationStars(result.stars);
    setShowCelebration(true);
  };

  const goToNext = () => {
    setShowCelebration(false);
    if (nextLesson) {
      navigation.replace(nextLesson.screen, nextLesson.params);
    } else {
      navigation.navigate('Home');
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <LevelCompleteCelebration
        visible={showCelebration}
        title="¡Lección completada!"
        levelName={studyLevel.title}
        stars={celebrationStars}
        passed
        nextLessonTitle={nextLesson?.levelTitle}
        onContinue={goToNext}
        onGoHome={() => {
          setShowCelebration(false);
          navigation.navigate('Home');
        }}
        onPractice={() => {
          setShowCelebration(false);
          navigation.navigate('PracticeSetup');
        }}
      />

      <ScrollView contentContainerStyle={styles.content}>
        <PageDots total={theory.pages.length} current={pageIndex} />
        <Text style={styles.kicker}>{studyLevel.title}</Text>

        {page.image ? (
          <TheoryIllustration
            imageKey={page.image.asset}
            caption={page.image.caption}
            attribution={page.image.attribution}
          />
        ) : null}

        <Text style={styles.title}>{page.title}</Text>
        <Text style={styles.body}>{page.body}</Text>

        {page.image?.sourceUrl ? (
          <Pressable onPress={() => Linking.openURL(page.image!.sourceUrl!)}>
            <Text style={styles.sourceLink}>Ver fuente</Text>
          </Pressable>
        ) : null}
      </ScrollView>
      <View style={styles.footer}>
        {pageIndex > 0 ? (
          <PrimaryButton
            label="Anterior"
            variant="secondary"
            onPress={() => setPageIndex((i) => i - 1)}
            style={styles.footerBtn}
          />
        ) : null}
        <PrimaryButton
          label={isLast ? 'Continuar' : 'Siguiente'}
          onPress={() => (isLast ? finish() : setPageIndex((i) => i + 1))}
          style={styles.footerBtn}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, gap: spacing.md },
  dots: {
    flexDirection: 'row',
    gap: spacing.xs,
    alignSelf: 'center',
    marginBottom: spacing.xs,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: radius.pill,
  },
  dotActive: { backgroundColor: colors.accent, width: 22 },
  dotIdle: { backgroundColor: colors.border },
  kicker: { color: colors.accent, fontSize: 13, fontWeight: '700' },
  title: { color: colors.text, fontSize: 24, fontWeight: '800' },
  body: { color: colors.textMuted, fontSize: 16, lineHeight: 24 },
  sourceLink: { color: colors.accent, fontSize: 12, textDecorationLine: 'underline' },
  footer: {
    flexDirection: 'row',
    padding: spacing.lg,
    gap: spacing.sm,
  },
  footerBtn: { flex: 1 },
});
