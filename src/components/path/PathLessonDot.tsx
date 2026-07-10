import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { PathLessonNode } from '../../data/curriculum/learningPath';
import ExerciseTypeIcon, { resolveExerciseIconType } from './ExerciseTypeIcon';
import { colors, radius, spacing } from '../../theme';

interface PathLessonDotProps {
  lesson: PathLessonNode;
  onPress: (lesson: PathLessonNode) => void;
  preview?: boolean;
}

const DOT_SIZE = 52;

function stateColors(state: PathLessonNode['state']) {
  switch (state) {
    case 'current':
      return { bg: colors.primary, border: colors.accent, icon: '#1c1917' };
    case 'available':
      return { bg: colors.surfaceAlt, border: colors.primary, icon: colors.text };
    case 'completed':
      return { bg: colors.correct, border: colors.correct, icon: '#fff' };
    case 'perfect':
      return { bg: colors.star, border: '#ca8a04', icon: '#1c1917' };
    default:
      return { bg: colors.surface, border: colors.locked, icon: colors.textMuted };
  }
}

export default function PathLessonDot({ lesson, onPress, preview }: PathLessonDotProps) {
  const palette = preview
    ? { bg: colors.surfaceAlt, border: colors.accent, icon: colors.text }
    : stateColors(lesson.state);
  const pulse = useSharedValue(1);
  const disabled = lesson.state === 'locked' && !preview;
  const iconType = resolveExerciseIconType(lesson.levelType, lesson.state, lesson.isBoss);

  useEffect(() => {
    if (lesson.state === 'current') {
      pulse.value = withRepeat(
        withTiming(1.1, { duration: 900, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
    } else {
      pulse.value = 1;
    }
  }, [lesson.state, pulse]);

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: lesson.state === 'current' ? pulse.value : 1 }],
  }));

  return (
    <Pressable
      onPress={() => !disabled && onPress(lesson)}
      disabled={disabled}
      style={({ pressed }) => [styles.wrap, pressed && !disabled && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={preview ? `${lesson.title} — vista previa` : lesson.title}
      accessibilityState={{ disabled }}
    >
      <Animated.View
        style={[
          styles.ring,
          ringStyle,
          {
            borderColor: palette.border,
            shadowColor: lesson.state === 'current' ? colors.accent : 'transparent',
          },
        ]}
      >
        <View style={[styles.dot, { backgroundColor: palette.bg }]}>
          <ExerciseTypeIcon
            type={lesson.levelType}
            variant={iconType}
            size={26}
            color={palette.icon}
          />
        </View>
      </Animated.View>
      <Text style={[styles.label, disabled && styles.labelLocked, preview && styles.labelPreview]} numberOfLines={2}>
        {lesson.title}
      </Text>
      {lesson.stars > 0 ? (
        <Text style={styles.stars}>
          {'★'.repeat(lesson.stars)}
          {'☆'.repeat(3 - lesson.stars)}
        </Text>
      ) : (
        <View style={styles.starsPlaceholder} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', width: DOT_SIZE + 56, gap: 2 },
  pressed: { opacity: 0.85 },
  ring: {
    padding: 3,
    borderRadius: radius.pill,
    borderWidth: 2,
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
    elevation: 3,
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: colors.text,
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 14,
    marginTop: 2,
  },
  labelLocked: { color: colors.textMuted },
  labelPreview: { color: colors.accent },
  stars: { fontSize: 9, color: colors.star, letterSpacing: -1 },
  starsPlaceholder: { height: 11 },
});
