import React, { useState } from 'react';
import { LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';
import {
  FutureStagePreview,
  PathLessonNode,
  PathModuleSection,
} from '../../data/curriculum/learningPath';
import BlockPager from './BlockPager';
import ExerciseTypeIcon, { EXERCISE_TYPE_LABELS } from './ExerciseTypeIcon';
import PathModuleSectionView from './PathModuleSection';
import { colors, radius, spacing } from '../../theme';
import { StageExerciseType } from '../../data/curriculum/types';

interface LearningPathMapProps {
  sections: PathModuleSection[];
  futureStages: FutureStagePreview[];
  activeBlockIndex: number;
  onBlockIndexChange: (index: number) => void;
  onLessonPress: (lesson: PathLessonNode) => void;
}

const LEGEND_TYPES: StageExerciseType[] = [
  'theory',
  'quiz',
  'fretboard',
  'recognition',
  'scrolling_reading',
  'speed',
  'exam',
];

function FutureStageGhost({ stage }: { stage: FutureStagePreview }) {
  return (
    <View style={styles.ghostRow}>
      <View style={styles.ghostCircle}>
        <Text style={styles.ghostEmoji}>{stage.locked ? '🔒' : stage.emoji}</Text>
      </View>
      <Text style={styles.ghostTitle}>{stage.title}</Text>
      <Text style={styles.ghostLabel}>{stage.label}</Text>
    </View>
  );
}

function IconLegend() {
  return (
    <View style={styles.legend}>
      {LEGEND_TYPES.map((type) => (
        <View key={type} style={styles.legendItem}>
          <ExerciseTypeIcon type={type} size={16} color={colors.textMuted} />
          <Text style={styles.legendLabel}>{EXERCISE_TYPE_LABELS[type]}</Text>
        </View>
      ))}
    </View>
  );
}

export default function LearningPathMap({
  sections,
  futureStages,
  activeBlockIndex,
  onBlockIndexChange,
  onLessonPress,
}: LearningPathMapProps) {
  const [mapWidth, setMapWidth] = useState(0);

  const section = sections[activeBlockIndex];
  const totalBlocks = sections.length;

  const onMapLayout = (e: LayoutChangeEvent) => {
    setMapWidth(e.nativeEvent.layout.width);
  };

  if (!section) return null;

  return (
    <View style={styles.wrap} onLayout={onMapLayout}>
      <Text style={styles.sectionTitle}>Tu camino</Text>

      <BlockPager
        section={section}
        blockIndex={activeBlockIndex}
        totalBlocks={totalBlocks}
        blockLocked={section.blockLocked}
        onSelectBlock={onBlockIndexChange}
      />

      <IconLegend />

      <PathModuleSectionView
        key={section.id}
        section={section}
        mapWidth={mapWidth}
        sectionOffsetY={0}
        onLessonPress={onLessonPress}
        hideHeader
      />

      {activeBlockIndex === totalBlocks - 1 ? (
        <View style={styles.futureSection}>
          <Text style={styles.futureTitle}>Próximas etapas</Text>
          {futureStages.map((stage) => (
            <FutureStageGhost key={stage.id} stage={stage} />
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.sm },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendLabel: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: '600',
  },
  futureSection: {
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
  },
  futureTitle: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  ghostRow: { alignItems: 'center', gap: spacing.xs, opacity: 0.75 },
  ghostCircle: {
    width: 56,
    height: 56,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ghostEmoji: { fontSize: 24 },
  ghostTitle: { color: colors.text, fontSize: 15, fontWeight: '700', textAlign: 'center' },
  ghostLabel: { color: colors.textMuted, fontSize: 12, textAlign: 'center' },
});
