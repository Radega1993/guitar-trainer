import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import StarRating from '../components/common/StarRating';
import PrimaryButton from '../components/common/PrimaryButton';
import { getLevel, getLevelByOrder } from '../data/levels';
import { useProgress } from '../storage/ProgressContext';
import { colors, radius, spacing } from '../theme';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Results'>;

function formatTime(ms: number): string {
  const totalSeconds = Math.round(ms / 1000);
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return m > 0 ? `${m} min ${s}s` : `${s}s`;
}

export default function ResultsScreen({ route, navigation }: Props) {
  const { levelId, result } = route.params;
  const level = getLevel(levelId)!;
  const { isLevelUnlocked } = useProgress();

  const nextLevel = getLevelByOrder(level.order + 1);
  const nextUnlocked = nextLevel ? isLevelUnlocked(nextLevel.id) : false;
  const canAdvance = Boolean(nextLevel && nextUnlocked && result.passed);

  const headline =
    result.stars === 3
      ? '¡Excelente!'
      : result.passed
      ? '¡Nivel superado!'
      : 'Nivel no superado';

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <View style={styles.content}>
        <View style={styles.top}>
          <Text style={styles.headline}>{headline}</Text>
          <Text style={styles.levelName}>{level.name}</Text>
          <View style={styles.stars}>
            <StarRating value={result.stars} size={44} />
          </View>
        </View>

        <View style={styles.statsRow}>
          <Stat label="Precisión" value={`${Math.round(result.accuracy * 100)}%`} />
          <Stat label="Error" value={`${Math.round(result.errorRate * 100)}%`} />
          <Stat label="Media resp." value={`${(result.avgResponseMs / 1000).toFixed(1)}s`} />
          <Stat label="Aciertos" value={`${result.correct}/${result.total}`} />
          <Stat label="Ronda" value={formatTime(result.timeMs)} />
        </View>

        {!result.passed && (
          <View style={styles.feedbackCard}>
            <Text style={styles.feedbackTitle}>Qué mejorar para superar el nivel</Text>
            {result.feedbackMessages.map((msg, idx) => (
              <Text key={idx} style={styles.feedbackItem}>
                • {msg}
              </Text>
            ))}
          </View>
        )}

        <View style={styles.actions}>
          {canAdvance && (
            <PrimaryButton
              label="Siguiente nivel"
              onPress={() => navigation.replace('Exercise', { levelId: nextLevel!.id })}
            />
          )}
          <PrimaryButton
            label="Repetir nivel"
            variant={nextLevel && nextUnlocked ? 'secondary' : 'primary'}
            onPress={() => navigation.replace('Exercise', { levelId: level.id })}
          />
          <PrimaryButton
            label="Volver a niveles"
            variant="secondary"
            onPress={() => navigation.navigate('LevelSelect')}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'space-between',
  },
  top: {
    alignItems: 'center',
    marginTop: spacing.xl,
    gap: spacing.sm,
  },
  headline: {
    color: colors.text,
    fontSize: 32,
    fontWeight: '800',
  },
  levelName: {
    color: colors.textMuted,
    fontSize: 16,
  },
  stars: {
    marginTop: spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  stat: {
    width: '48%',
    flexGrow: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  statValue: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
  },
  statLabel: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 4,
  },
  feedbackCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    padding: spacing.md,
    gap: spacing.xs,
  },
  feedbackTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  feedbackItem: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  actions: {
    gap: spacing.sm,
  },
});
