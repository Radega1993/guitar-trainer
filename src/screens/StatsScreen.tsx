import React, { useCallback, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import PrimaryButton from '../components/PrimaryButton';
import ErrorHotspotsCard from '../components/stats/ErrorHotspotsCard';
import PersonalizedTipsCard from '../components/stats/PersonalizedTipsCard';
import ProgressTrendCard from '../components/stats/ProgressTrendCard';
import StatsFilterChips from '../components/stats/StatsFilterChips';
import StatsKpiGrid from '../components/stats/StatsKpiGrid';
import { loadUserStats } from '../analytics/statsAggregator';
import { StatsTimeFilter, UserStatsViewModel } from '../analytics/types';
import { useProgress } from '../storage/ProgressContext';
import { colors, radius, spacing } from '../theme';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Stats'>;

export default function StatsScreen(_props: Props) {
  const { resetProgress } = useProgress();
  const [filter, setFilter] = useState<StatsTimeFilter>(14);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<UserStatsViewModel | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    const next = await loadUserStats(filter);
    setStats(next);
    setLoading(false);
  }, [filter]);

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh])
  );

  const confirmReset = () => {
    Alert.alert('Reiniciar progreso', '¿Seguro que quieres borrar todo tu progreso?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Borrar',
        style: 'destructive',
        onPress: () => {
          resetProgress();
          setStats(null);
          void refresh();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <StatsFilterChips value={filter} onChange={setFilter} />

        {loading || !stats ? (
          <Text style={styles.loading}>Cargando estadísticas...</Text>
        ) : (
          <>
            <StatsKpiGrid kpis={stats.kpis} />
            <ErrorHotspotsCard
              notes={stats.hotspots.worstNotes}
              strings={stats.hotspots.worstStrings}
            />
            <ProgressTrendCard points={stats.trend} delta7d={stats.trendDelta7d} />
            <PersonalizedTipsCard tips={stats.tips} />
          </>
        )}

        <PrimaryButton
          label="Reiniciar progreso"
          variant="secondary"
          onPress={confirmReset}
          style={styles.resetButton}
        />
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
    gap: spacing.md,
  },
  loading: {
    color: colors.textMuted,
    fontSize: 14,
    paddingVertical: spacing.lg,
  },
  resetButton: {
    marginTop: spacing.lg,
  },
});
