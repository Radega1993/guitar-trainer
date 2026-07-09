import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { PathModuleSection } from '../../data/curriculum/learningPath';
import { colors, radius, spacing } from '../../theme';

interface BlockPagerProps {
  section: PathModuleSection;
  blockIndex: number;
  totalBlocks: number;
  blockLocked: boolean;
  onSelectBlock: (index: number) => void;
}

export default function BlockPager({
  section,
  blockIndex,
  totalBlocks,
  blockLocked,
  onSelectBlock,
}: BlockPagerProps) {
  const canGoPrev = blockIndex > 0;
  const canGoNext = blockIndex < totalBlocks - 1;

  return (
    <View style={styles.wrap}>
      <Pressable
        onPress={() => onSelectBlock(blockIndex - 1)}
        disabled={!canGoPrev}
        style={({ pressed }) => [
          styles.arrowBtn,
          !canGoPrev && styles.arrowDisabled,
          pressed && canGoPrev && styles.arrowPressed,
        ]}
        accessibilityRole="button"
        accessibilityLabel="Bloque anterior"
      >
        <Text style={[styles.arrow, !canGoPrev && styles.arrowTextDisabled]}>‹</Text>
      </Pressable>

      <View style={styles.center}>
        <Text style={styles.kicker}>
          Bloque {blockIndex + 1} / {totalBlocks}
          {blockLocked ? ' · Vista previa' : ''}
        </Text>
        <Text style={styles.title} numberOfLines={1}>
          {section.moduleTitle}
        </Text>
        <View style={styles.dots}>
          {Array.from({ length: totalBlocks }, (_, i) => (
            <Pressable
              key={i}
              onPress={() => onSelectBlock(i)}
              accessibilityRole="button"
              accessibilityLabel={`Ir al bloque ${i + 1}`}
              hitSlop={4}
            >
              <View style={[styles.dot, i === blockIndex && styles.dotActive]} />
            </Pressable>
          ))}
        </View>
      </View>

      <Pressable
        onPress={() => onSelectBlock(blockIndex + 1)}
        disabled={!canGoNext}
        style={({ pressed }) => [
          styles.arrowBtn,
          !canGoNext && styles.arrowDisabled,
          pressed && canGoNext && styles.arrowPressed,
        ]}
        accessibilityRole="button"
        accessibilityLabel="Bloque siguiente"
      >
        <Text style={[styles.arrow, !canGoNext && styles.arrowTextDisabled]}>›</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  arrowBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceAlt,
  },
  arrowDisabled: { opacity: 0.35 },
  arrowPressed: { opacity: 0.8 },
  arrow: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '300',
    lineHeight: 30,
    marginTop: -2,
  },
  arrowTextDisabled: { color: colors.textMuted },
  center: { flex: 1, alignItems: 'center', gap: 4 },
  kicker: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
  },
  dots: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 4,
    flexWrap: 'wrap',
    justifyContent: 'center',
    maxWidth: '100%',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.border,
  },
  dotActive: {
    width: 18,
    backgroundColor: colors.primary,
  },
});
