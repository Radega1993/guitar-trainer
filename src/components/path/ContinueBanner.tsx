import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LessonDestination } from '../../data/curriculum/pathNavigation';
import { colors, radius, spacing } from '../../theme';

interface ContinueBannerProps {
  destination: LessonDestination | null;
  onPress: () => void;
}

export default function ContinueBanner({ destination, onPress }: ContinueBannerProps) {
  if (!destination) return null;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.banner, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel="Continuar lección"
    >
      <View>
        <Text style={styles.kicker}>{destination.moduleTitle}</Text>
        <Text style={styles.lesson}>{destination.levelTitle}</Text>
      </View>
      <View style={styles.cta}>
        <Text style={styles.ctaText}>CONTINUAR</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  pressed: { opacity: 0.9 },
  kicker: { color: colors.textMuted, fontSize: 12, fontWeight: '600' },
  lesson: { color: colors.text, fontSize: 16, fontWeight: '800', marginTop: 2 },
  cta: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
  },
  ctaText: { color: '#1c1917', fontSize: 14, fontWeight: '900', letterSpacing: 0.5 },
});
