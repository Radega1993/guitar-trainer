import React, { useCallback, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import LearningPathMap from '../components/path/LearningPathMap';
import ModuleCompleteToast from '../components/path/ModuleCompleteToast';
import PathHeader from '../components/path/PathHeader';
import PrimaryButton from '../components/common/PrimaryButton';
import { getStudyLevelById } from '../data/curriculum';
import {
  buildFutureStagePreviews,
  buildLearningPathSections,
  getActiveBlockIndex,
  PathLessonNode,
} from '../data/curriculum/learningPath';
import { resolveLessonForLevel } from '../data/curriculum/pathNavigation';
import { getStage1Progress } from '../data/curriculum/roadmapProgress';
import { useProgress } from '../storage/ProgressContext';
import { colors, spacing } from '../theme';
import { RootStackParamList } from '../navigation/types';
import { STORE_CAPTURE_MODE } from '../app/config/storeCapture';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const { isStudyBlockUnlocked, state } = useProgress();
  const initializedRef = React.useRef(false);
  const prevCompletedRef = React.useRef(0);
  const [toast, setToast] = useState({ visible: false, title: '' });
  const [blockPageIndex, setBlockPageIndex] = useState(0);

  const pathSections = useMemo(
    () => buildLearningPathSections(state, isStudyBlockUnlocked),
    [state, isStudyBlockUnlocked]
  );
  const futureStages = useMemo(() => buildFutureStagePreviews(state), [state]);

  const handleLessonPress = useCallback(
    (lesson: PathLessonNode) => {
      const activeSection = pathSections[blockPageIndex];
      const studyLevel = getStudyLevelById(lesson.studyLevelId);
      const isTheoryPreview =
        lesson.state === 'locked' &&
        activeSection?.blockLocked &&
        studyLevel?.stageLevelType === 'theory';

      if (lesson.state === 'locked' && !isTheoryPreview) return;

      if (isTheoryPreview) {
        navigation.navigate('TheoryLesson', { studyLevelId: lesson.studyLevelId, preview: true });
        return;
      }

      const dest = resolveLessonForLevel(lesson.studyLevelId, state);
      if (dest) navigation.navigate(dest.screen, dest.params);
    },
    [blockPageIndex, navigation, pathSections, state]
  );

  useFocusEffect(
    useCallback(() => {
      const progress = getStage1Progress(state);
      const completedNewBlock =
        initializedRef.current && progress.completedBlocks > prevCompletedRef.current;

      if (completedNewBlock) {
        const lastComplete = [...pathSections].reverse().find((s) => s.blockComplete);
        setToast({ visible: true, title: lastComplete?.moduleTitle ?? 'Módulo' });
        setBlockPageIndex(getActiveBlockIndex(pathSections, state, isStudyBlockUnlocked));
      } else if (!initializedRef.current) {
        setBlockPageIndex(getActiveBlockIndex(pathSections, state, isStudyBlockUnlocked));
      }

      initializedRef.current = true;
      prevCompletedRef.current = progress.completedBlocks;
    }, [pathSections, state, isStudyBlockUnlocked])
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ModuleCompleteToast
        moduleTitle={toast.title}
        visible={toast.visible}
        onDismiss={() => setToast((t) => ({ ...t, visible: false }))}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <PathHeader
          onPractice={() => navigation.navigate('PracticeSetup')}
          onStats={() => navigation.navigate('Stats')}
          onSettings={() => navigation.navigate('Settings')}
        />

        <LearningPathMap
          sections={pathSections}
          futureStages={futureStages}
          activeBlockIndex={blockPageIndex}
          onBlockIndexChange={setBlockPageIndex}
          onLessonPress={handleLessonPress}
        />

        {STORE_CAPTURE_MODE ? (
          <View style={styles.capturePanel}>
            <PrimaryButton
              label="Capture: Theory"
              variant="secondary"
              onPress={() => navigation.navigate('TheoryLesson', { studyLevelId: 'stage1-block1-level2' })}
            />
            <PrimaryButton
              label="Capture: Staff"
              variant="secondary"
              onPress={() => navigation.navigate('Recognition', { studyLevelId: 'stage1-block1-level6' })}
            />
            <PrimaryButton
              label="Capture: Fretboard"
              variant="secondary"
              onPress={() =>
                navigation.navigate('Exercise', {
                  sessionMode: 'level',
                  studyLevelId: 'stage1-block1-level7',
                  sourceId: 'stage1-block1-level7',
                })
              }
            />
            <PrimaryButton
              label="Capture: Reading"
              variant="secondary"
              onPress={() =>
                navigation.navigate('Exercise', {
                  sessionMode: 'level',
                  studyLevelId: 'stage1-block1-level24',
                  sourceId: 'stage1-block1-level24',
                })
              }
            />
            <PrimaryButton
              label="Capture: Quiz"
              variant="secondary"
              onPress={() => navigation.navigate('Quiz', { studyLevelId: 'stage1-block1-level5' })}
            />
            <PrimaryButton
              label="Capture: Practice"
              variant="secondary"
              onPress={() => navigation.navigate('PracticeSetup')}
            />
            <PrimaryButton
              label="Capture: Progress"
              variant="secondary"
              onPress={() => navigation.navigate('Stats')}
            />
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.lg,
    paddingBottom: spacing.xl * 2,
  },
  capturePanel: {
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceAlt,
  },
});
