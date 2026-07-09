import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { colors, radius, spacing } from '../../theme';

interface ModuleCompleteToastProps {
  moduleTitle: string;
  visible: boolean;
  onDismiss: () => void;
}

export default function ModuleCompleteToast({
  moduleTitle,
  visible,
  onDismiss,
}: ModuleCompleteToastProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(-20);

  useEffect(() => {
    if (!visible) {
      opacity.value = 0;
      translateY.value = -20;
      return;
    }
    opacity.value = withTiming(1, { duration: 250 });
    translateY.value = withTiming(0, { duration: 300, easing: Easing.out(Easing.cubic) });
    opacity.value = withDelay(
      2800,
      withTiming(0, { duration: 300 }, (finished) => {
        if (finished) runOnJS(onDismiss)();
      })
    );
  }, [visible, moduleTitle, onDismiss, opacity, translateY]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  if (!visible) return null;

  return (
    <Animated.View style={[styles.toast, style]} pointerEvents="none">
      <Text style={styles.emoji}>🎉</Text>
      <View style={styles.textWrap}>
        <Text style={styles.title}>¡Módulo completado!</Text>
        <Text style={styles.subtitle}>{moduleTitle}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.lg,
    right: spacing.lg,
    zIndex: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 2,
    borderColor: colors.correct,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  emoji: { fontSize: 28 },
  textWrap: { flex: 1 },
  title: { color: colors.text, fontSize: 15, fontWeight: '800' },
  subtitle: { color: colors.textMuted, fontSize: 13, marginTop: 2 },
});
