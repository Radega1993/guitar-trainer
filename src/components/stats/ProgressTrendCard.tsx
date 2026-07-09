import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TrendPoint } from '../../analytics/types';
import { colors, radius, spacing } from '../../theme';

interface ProgressTrendCardProps {
  points: TrendPoint[];
  delta7d: number;
}

function dayLabel(day: string): string {
  return day.slice(5);
}

export default function ProgressTrendCard({ points, delta7d }: ProgressTrendCardProps) {
  const max = Math.max(...points.map((p) => p.accuracyPct), 100);
  const last = points[points.length - 1]?.accuracyPct ?? 0;
  const deltaPrefix = delta7d > 0 ? '+' : '';

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Evolución</Text>
        <Text style={styles.subtitle}>
          Último {last}% · 7d {deltaPrefix}
          {delta7d.toFixed(1)} pts
        </Text>
      </View>
      <View style={styles.chart}>
        {points.map((p, i) => (
          <View key={`${p.day}-${i}`} style={styles.col}>
            <View style={styles.barTrack}>
              <View
                style={[
                  styles.barFill,
                  { height: `${Math.max((p.accuracyPct / max) * 100, 2)}%` },
                ]}
              />
            </View>
            <Text style={styles.day}>{dayLabel(p.day)}</Text>
          </View>
        ))}
      </View>
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
  },
  header: {
    marginBottom: spacing.sm,
  },
  title: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '700',
  },
  subtitle: {
    color: colors.textMuted,
    marginTop: 2,
    fontSize: 12,
  },
  chart: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'flex-end',
    minHeight: 120,
  },
  col: {
    flex: 1,
    alignItems: 'center',
  },
  barTrack: {
    width: '100%',
    height: 92,
    borderRadius: 6,
    justifyContent: 'flex-end',
    backgroundColor: colors.surfaceAlt,
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    backgroundColor: colors.accent,
  },
  day: {
    marginTop: 6,
    color: colors.textMuted,
    fontSize: 10,
  },
});
