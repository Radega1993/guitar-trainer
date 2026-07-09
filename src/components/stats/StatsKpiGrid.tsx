import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StatsKpis } from '../../analytics/types';
import { colors, radius, spacing } from '../../theme';

interface StatsKpiGridProps {
  kpis: StatsKpis;
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

export default function StatsKpiGrid({ kpis }: StatsKpiGridProps) {
  return (
    <View style={styles.grid}>
      <Metric label="Niveles completados" value={`${kpis.levelsCompleted}`} />
      <Metric label="Estrellas totales" value={`${kpis.totalStars}`} />
      <Metric label="Precisión global" value={`${kpis.accuracyPct}%`} />
      <Metric label="Tiempo medio resp." value={`${kpis.avgResponseSeconds.toFixed(1)}s`} />
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  metric: {
    width: '48%',
    flexGrow: 1,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: spacing.md,
  },
  metricValue: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '800',
  },
  metricLabel: {
    color: colors.textMuted,
    marginTop: 4,
    fontSize: 12,
  },
});
