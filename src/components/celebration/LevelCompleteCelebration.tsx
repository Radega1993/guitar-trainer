import React, { useEffect } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import PrimaryButton from '../common/PrimaryButton';
import StarRating from '../common/StarRating';
import { colors, radius, spacing } from '../../theme';

export interface LevelCompleteCelebrationProps {
  visible: boolean;
  title: string;
  levelName: string;
  stars: number;
  passed: boolean;
  nextLessonTitle?: string;
  onContinue: () => void;
  onGoHome: () => void;
  onPractice?: () => void;
  stats?: { label: string; value: string }[];
  feedback?: string[];
  embedded?: boolean;
}

export default function LevelCompleteCelebration({
  visible,
  title,
  levelName,
  stars,
  passed,
  nextLessonTitle,
  onContinue,
  onGoHome,
  onPractice,
  stats,
  feedback,
  embedded = false,
}: LevelCompleteCelebrationProps) {
  const scale = useSharedValue(0.6);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 200 });
      scale.value = withSequence(
        withSpring(1.08, { damping: 8, stiffness: 180 }),
        withTiming(1, { duration: 200, easing: Easing.out(Easing.cubic) })
      );
    } else {
      opacity.value = 0;
      scale.value = 0.6;
    }
  }, [visible, opacity, scale]);

  const cardStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const emoji = passed ? (stars >= 3 ? '🏆' : stars >= 2 ? '⭐' : '🎉') : '💪';
  const subtitle = passed
    ? nextLessonTitle
      ? `Siguiente: ${nextLessonTitle}`
      : '¡Sigue así! Cada práctica te acerca a dominar la guitarra.'
    : 'No pasa nada — repite el nivel y lo conseguirás.';

  const card = (
    <Animated.View style={[styles.card, embedded ? null : cardStyle]}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.levelName}>{levelName}</Text>

      {passed ? (
        <View style={styles.stars}>
          <StarRating value={stars} size={36} />
        </View>
      ) : null}

      <Text style={styles.subtitle}>{subtitle}</Text>

      {stats && stats.length > 0 ? (
        <View style={styles.statsRow}>
          {stats.map((s) => (
            <View key={s.label} style={styles.stat}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>
      ) : null}

      {feedback && feedback.length > 0 ? (
        <View style={styles.feedback}>
          {feedback.map((msg) => (
            <Text key={msg} style={styles.feedbackItem}>
              • {msg}
            </Text>
          ))}
        </View>
      ) : null}

      <View style={styles.actions}>
        {passed && nextLessonTitle ? (
          <PrimaryButton label="Siguiente lección" onPress={onContinue} />
        ) : passed ? (
          <PrimaryButton label="Continuar practicando" onPress={onContinue} />
        ) : (
          <PrimaryButton label="Reintentar" onPress={onContinue} />
        )}
        <PrimaryButton label="Volver al camino" variant="secondary" onPress={onGoHome} />
        {onPractice && passed ? (
          <PrimaryButton label="Práctica libre" variant="secondary" onPress={onPractice} />
        ) : null}
      </View>
    </Animated.View>
  );

  if (embedded) {
    if (!visible) return null;
    return <View style={styles.embeddedWrap}>{card}</View>;
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onGoHome}>
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onGoHome} accessibilityLabel="Cerrar" />
        {card}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.72)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  emoji: { fontSize: 56, marginBottom: spacing.xs },
  title: { color: colors.text, fontSize: 26, fontWeight: '900', textAlign: 'center' },
  levelName: { color: colors.textMuted, fontSize: 15, textAlign: 'center' },
  stars: { marginVertical: spacing.sm },
  subtitle: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    width: '100%',
    marginBottom: spacing.sm,
  },
  stat: {
    flex: 1,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  statValue: { color: colors.text, fontSize: 16, fontWeight: '800' },
  statLabel: { color: colors.textMuted, fontSize: 11, marginTop: 2 },
  feedback: { width: '100%', gap: 2, marginBottom: spacing.xs },
  feedbackItem: { color: colors.textMuted, fontSize: 12, lineHeight: 16 },
  actions: { width: '100%', gap: spacing.sm, marginTop: spacing.xs },
  embeddedWrap: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
});
