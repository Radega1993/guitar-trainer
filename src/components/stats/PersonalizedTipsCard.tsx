import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StatsTip } from '../../analytics/types';
import { colors, radius, spacing } from '../../theme';

interface PersonalizedTipsCardProps {
  tips: StatsTip[];
}

function dotColor(severity: StatsTip['severity']): string {
  if (severity === 'high') return colors.wrong;
  if (severity === 'medium') return colors.accent;
  return colors.correct;
}

export default function PersonalizedTipsCard({ tips }: PersonalizedTipsCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Consejos automáticos</Text>
      {tips.map((tip) => (
        <View key={tip.id} style={styles.tipRow}>
          <View style={[styles.dot, { backgroundColor: dotColor(tip.severity) }]} />
          <Text style={styles.tipText}>{tip.text}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    padding: spacing.md,
    gap: spacing.sm,
  },
  title: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '700',
  },
  tipRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'flex-start',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: radius.pill,
    marginTop: 6,
  },
  tipText: {
    flex: 1,
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
});
