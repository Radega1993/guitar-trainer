import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '../../theme';

export interface PracticeLiveStats {
  attempts: number;
  correct: number;
  accuracy: number;
  avgResponseMs: number;
  streak: number;
  responsesPerMin: number;
}

export default function PracticeLiveStatsBar({ stats }: { stats: PracticeLiveStats }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.item}>Resp: {stats.attempts}</Text>
      <Text style={styles.item}>Acierto: {Math.round(stats.accuracy * 100)}%</Text>
      <Text style={styles.item}>Racha: {stats.streak}</Text>
      <Text style={styles.item}>RPM: {Math.round(stats.responsesPerMin)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.sm,
  },
  item: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '700',
  },
});

