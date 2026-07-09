import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import LevelCompleteCelebration from '../components/celebration/LevelCompleteCelebration';
import { getLevel } from '../data/levels';
import { getStudyLevelById } from '../data/curriculum';
import { resolveNextLessonAfterCompleting } from '../data/curriculum/pathNavigation';
import { useProgress } from '../storage/ProgressContext';
import { colors } from '../theme';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Results'>;

function formatTime(ms: number): string {
  const totalSeconds = Math.round(ms / 1000);
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return m > 0 ? `${m} min ${s}s` : `${s}s`;
}

export default function ResultsScreen({ route, navigation }: Props) {
  const { levelId, result, studyLevelId, title } = route.params;
  const level = getLevel(levelId);
  const studyLevel = studyLevelId ? getStudyLevelById(studyLevelId) : undefined;
  const { state } = useProgress();

  const displayName = title ?? studyLevel?.title ?? level?.name ?? 'Ejercicio';

  const nextLesson = useMemo(
    () => (studyLevelId ? resolveNextLessonAfterCompleting(studyLevelId, state) : null),
    [studyLevelId, state]
  );

  const headline =
    result.stars === 3
      ? '¡Excelente!'
      : result.passed
      ? '¡Nivel superado!'
      : 'Casi lo tienes';

  const goToNext = () => {
    if (!result.passed) {
      if (studyLevelId && studyLevel?.stageLevelType === 'theory') {
        navigation.replace('TheoryLesson', { studyLevelId });
      } else if (studyLevelId && studyLevel?.stageLevelType === 'quiz') {
        navigation.replace('Quiz', { studyLevelId });
      } else if (studyLevelId && studyLevel?.stageLevelType === 'recognition') {
        navigation.replace('Recognition', { studyLevelId });
      } else if (studyLevelId) {
        navigation.replace('Exercise', {
          sessionMode: 'level',
          studyLevelId,
          sourceId: studyLevelId,
        });
      } else if (level) {
        navigation.replace('Exercise', { levelId: level.id });
      }
      return;
    }

    if (nextLesson) {
      navigation.replace(nextLesson.screen, nextLesson.params);
    } else {
      navigation.navigate('Home');
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <View style={styles.center}>
        <LevelCompleteCelebration
          visible
          embedded
          title={headline}
          levelName={displayName}
          stars={result.stars}
          passed={result.passed}
          nextLessonTitle={result.passed ? nextLesson?.levelTitle : undefined}
          onContinue={goToNext}
          onGoHome={() => navigation.navigate('Home')}
          onPractice={result.passed ? () => navigation.navigate('PracticeSetup') : undefined}
          stats={[
            { label: 'Precisión', value: `${Math.round(result.accuracy * 100)}%` },
            { label: 'Aciertos', value: `${result.correct}/${result.total}` },
            ...(result.scoringMode === 'accuracy_and_speed'
              ? [{ label: 'Tiempo', value: formatTime(result.timeMs) }]
              : []),
          ]}
          feedback={!result.passed ? result.feedbackMessages.slice(0, 2) : undefined}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
  },
});
