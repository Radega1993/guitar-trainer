import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import StarRating from '../components/common/StarRating';
import { LEVELS } from '../data/levels';
import { useProgress } from '../storage/ProgressContext';
import { colors, radius, spacing } from '../theme';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'LevelSelect'>;

export default function LevelSelectScreen({ navigation }: Props) {
  const { getLevelProgress, isLevelUnlocked } = useProgress();

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.intro}>
          Completa un nivel con al menos una estrella para desbloquear el siguiente.
        </Text>
        {LEVELS.map((level) => {
          const progress = getLevelProgress(level.id);
          const unlocked = isLevelUnlocked(level.id);
          return (
            <Pressable
              key={level.id}
              disabled={!unlocked}
              onPress={() => navigation.navigate('Exercise', { levelId: level.id })}
              style={({ pressed }) => [
                styles.card,
                !unlocked && styles.cardLocked,
                pressed && unlocked && styles.cardPressed,
              ]}
            >
              <View style={styles.orderBadge}>
                <Text style={styles.orderText}>{unlocked ? level.order : '\u{1F512}'}</Text>
              </View>
              <View style={styles.cardBody}>
                <Text style={[styles.cardTitle, !unlocked && styles.mutedText]}>
                  {level.name}
                </Text>
                <Text style={styles.cardDesc}>{level.description}</Text>
              </View>
              <View style={styles.cardRight}>
                <StarRating value={progress?.bestStars ?? 0} size={16} />
                {progress?.bestAccuracy != null && (
                  <Text style={styles.accuracy}>
                    {Math.round(progress.bestAccuracy * 100)}%
                  </Text>
                )}
              </View>
            </Pressable>
          );
        })}
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
    gap: spacing.sm,
  },
  intro: {
    color: colors.textMuted,
    fontSize: 14,
    marginBottom: spacing.xs,
    lineHeight: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardLocked: {
    opacity: 0.55,
  },
  cardPressed: {
    backgroundColor: colors.surfaceAlt,
  },
  orderBadge: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderText: {
    color: colors.accent,
    fontSize: 16,
    fontWeight: '800',
  },
  cardBody: {
    flex: 1,
    gap: 2,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  mutedText: {
    color: colors.textMuted,
  },
  cardDesc: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
  },
  cardRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  accuracy: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
});
