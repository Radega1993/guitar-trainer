import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { RoadmapBlock } from '../../data/curriculum/roadmap';
import { colors, radius, spacing } from '../../theme';

interface StageBlockRowProps {
  block: RoadmapBlock;
  done: boolean;
  unlocked: boolean;
  isLast?: boolean;
  onPress?: () => void;
}

export default function StageBlockRow({
  block,
  done,
  unlocked,
  isLast,
  onPress,
}: StageBlockRowProps) {
  const canPress = unlocked && onPress;

  return (
    <View style={styles.row}>
      <View style={styles.rail}>
        <View
          style={[
            styles.dot,
            done && styles.dotDone,
            !unlocked && styles.dotLocked,
          ]}
        />
        {!isLast ? <View style={[styles.line, done && styles.lineDone]} /> : null}
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.card,
          !unlocked && styles.cardLocked,
          pressed && canPress && styles.cardPressed,
        ]}
        disabled={!canPress}
        onPress={onPress}
      >
        <Text style={[styles.title, !unlocked && styles.titleLocked]}>{block.title}</Text>
        <Text style={styles.status}>
          {done ? 'Completado' : unlocked ? 'Continuar' : 'Bloqueado'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
    minHeight: 56,
  },
  rail: {
    width: 20,
    alignItems: 'center',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.border,
    marginTop: 14,
  },
  dotDone: {
    backgroundColor: colors.correct,
  },
  dotLocked: {
    backgroundColor: colors.locked,
  },
  line: {
    flex: 1,
    width: 2,
    backgroundColor: colors.border,
    marginTop: 4,
    marginBottom: -4,
  },
  lineDone: {
    backgroundColor: colors.correct,
  },
  card: {
    flex: 1,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.xs,
  },
  cardLocked: {
    opacity: 0.55,
  },
  cardPressed: {
    borderColor: colors.accent,
  },
  title: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  titleLocked: {
    color: colors.textMuted,
  },
  status: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
});
