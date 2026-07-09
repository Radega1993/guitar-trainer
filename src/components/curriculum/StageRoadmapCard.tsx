import React, { useState } from 'react';
import { LayoutAnimation, Platform, Pressable, StyleSheet, Text, UIManager, View } from 'react-native';
import { RoadmapStage } from '../../data/curriculum/roadmap';
import {
  getStageAvailability,
  getStageStatusLabel,
  isRoadmapBlockDone,
  isRoadmapBlockUnlocked,
} from '../../data/curriculum/roadmapProgress';
import { ProgressState } from '../../storage/types';
import { colors, radius, spacing } from '../../theme';
import StageBlockRow from './StageBlockRow';
import StageGrowthIcon from './StageGrowthIcon';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface StageRoadmapCardProps {
  stage: RoadmapStage;
  state: ProgressState;
  isStudyBlockUnlocked: (blockId: string) => boolean;
  isLast?: boolean;
  onOpenBlock?: (curriculumBlockId: string) => void;
}

export default function StageRoadmapCard({
  stage,
  state,
  isStudyBlockUnlocked,
  isLast,
  onOpenBlock,
}: StageRoadmapCardProps) {
  const availability = getStageAvailability(stage, state);
  const isActive = availability === 'active';
  const isLocked = availability === 'locked';
  const isComingSoon = availability === 'coming_soon' || availability === 'post_mvp';
  const [expanded, setExpanded] = useState(isActive);

  const statusLabel = getStageStatusLabel(stage, state);

  const toggle = () => {
    if (isLocked) return;
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((v) => !v);
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.trunk}>
        {!isLast ? <View style={[styles.trunkLine, isActive && styles.trunkLineActive]} /> : null}
      </View>

      <View style={styles.card}>
        <Pressable
          style={({ pressed }) => [styles.header, pressed && !isLocked && styles.headerPressed]}
          onPress={toggle}
          disabled={isLocked}
        >
          <StageGrowthIcon
            icon={stage.icon}
            emoji={stage.emoji}
            dimmed={isLocked || isComingSoon}
          />
          <View style={styles.headerText}>
            <Text style={[styles.title, (isLocked || isComingSoon) && styles.titleMuted]}>
              {stage.emoji} {stage.title}
            </Text>
            <Text style={styles.status}>{statusLabel}</Text>
          </View>
          {!isLocked ? (
            <Text style={styles.chevron}>{expanded ? '▾' : '▸'}</Text>
          ) : (
            <Text style={styles.lock}>🔒</Text>
          )}
        </Pressable>

        {expanded && !isLocked ? (
          <View style={styles.body}>
            <Text style={styles.objective}>{stage.objective}</Text>

            {isActive ? (
              <View style={styles.blockList}>
                {stage.blocks.map((block, index) => {
                  const curriculumId = block.curriculumBlockId;
                  if (!curriculumId) return null;
                  return (
                    <StageBlockRow
                      key={block.id}
                      block={block}
                      done={isRoadmapBlockDone(curriculumId, state)}
                      unlocked={isRoadmapBlockUnlocked(curriculumId, state, isStudyBlockUnlocked)}
                      isLast={index === stage.blocks.length - 1}
                      onPress={() => onOpenBlock?.(curriculumId)}
                    />
                  );
                })}
              </View>
            ) : (
              <View style={styles.previewList}>
                {stage.blocks.map((block) => (
                  <Text key={block.id} style={styles.previewItem}>
                    · {block.title}
                  </Text>
                ))}
                <View style={styles.soonBadge}>
                  <Text style={styles.soonText}>
                    {availability === 'post_mvp'
                      ? 'Academias y especializaciones — disponible en futuras versiones'
                      : 'Contenido en desarrollo — próximamente'}
                  </Text>
                </View>
              </View>
            )}

            {isActive && getStageStatusLabel(stage, state) === 'Completada' ? (
              <View style={styles.outcome}>
                <Text style={styles.outcomeLabel}>Fin de etapa</Text>
                <Text style={styles.outcomeText}>🎓 {stage.outcome}</Text>
              </View>
            ) : null}
          </View>
        ) : null}

        {isLocked ? (
          <View style={styles.lockedHint}>
            <Text style={styles.lockedText}>Se desbloquea al completar la etapa anterior</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  trunk: {
    width: 16,
    alignItems: 'center',
  },
  trunkLine: {
    flex: 1,
    width: 3,
    backgroundColor: colors.border,
    borderRadius: 2,
    marginTop: spacing.xs,
  },
  trunkLineActive: {
    backgroundColor: colors.correct,
  },
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
  },
  headerPressed: {
    backgroundColor: colors.surfaceAlt,
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  title: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '700',
  },
  titleMuted: {
    color: colors.textMuted,
  },
  status: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '600',
  },
  chevron: {
    color: colors.textMuted,
    fontSize: 18,
    fontWeight: '700',
  },
  lock: {
    fontSize: 16,
    opacity: 0.7,
  },
  body: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    gap: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  objective: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: spacing.sm,
  },
  blockList: {
    marginTop: spacing.sm,
  },
  previewList: {
    gap: 4,
    marginTop: spacing.xs,
  },
  previewItem: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 20,
  },
  soonBadge: {
    marginTop: spacing.sm,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  soonText: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 18,
    fontStyle: 'italic',
  },
  outcome: {
    marginTop: spacing.sm,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.correct,
  },
  outcomeLabel: {
    color: colors.correct,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  outcomeText: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
  },
  lockedHint: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  lockedText: {
    color: colors.textMuted,
    fontSize: 13,
    fontStyle: 'italic',
  },
});
