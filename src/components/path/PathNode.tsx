import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { PathNode as PathNodeData } from '../../data/curriculum/learningPath';
import { colors, radius, spacing } from '../../theme';

interface PathNodeProps {
  node: PathNodeData;
  onPress: (node: PathNodeData) => void;
}

const NODE_SIZE = 68;

function stateColors(state: PathNodeData['state']) {
  switch (state) {
    case 'current':
      return { bg: colors.primary, border: colors.accent, text: '#1c1917' };
    case 'available':
      return { bg: colors.surfaceAlt, border: colors.primary, text: colors.text };
    case 'completed':
      return { bg: colors.correct, border: colors.correct, text: '#fff' };
    case 'perfect':
      return { bg: colors.star, border: '#ca8a04', text: '#1c1917' };
    default:
      return { bg: colors.surface, border: colors.locked, text: colors.textMuted };
  }
}

function nodeIcon(node: PathNodeData): string {
  if (node.state === 'locked') return '🔒';
  if (node.isBoss) return '👑';
  if (node.state === 'completed' || node.state === 'perfect') return '✓';
  return '🎸';
}

function StarRow({ count }: { count: number }) {
  return (
    <View style={styles.stars}>
      {[0, 1, 2].map((i) => (
        <Text key={i} style={[styles.star, i < count ? styles.starOn : styles.starOff]}>
          ★
        </Text>
      ))}
    </View>
  );
}

export default function PathNode({ node, onPress }: PathNodeProps) {
  const palette = stateColors(node.state);
  const pulse = useSharedValue(1);
  const disabled = node.state === 'locked';

  useEffect(() => {
    if (node.state === 'current') {
      pulse.value = withRepeat(
        withTiming(1.08, { duration: 900, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
    } else {
      pulse.value = 1;
    }
  }, [node.state, pulse]);

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: node.state === 'current' ? pulse.value : 1 }],
  }));

  return (
    <Pressable
      onPress={() => !disabled && onPress(node)}
      disabled={disabled}
      style={({ pressed }) => [styles.pressable, pressed && !disabled ? styles.pressed : null]}
      accessibilityRole="button"
      accessibilityLabel={node.moduleTitle}
      accessibilityState={{ disabled }}
    >
      <Animated.View
        style={[
          styles.ring,
          ringStyle,
          {
            borderColor: palette.border,
            shadowColor: node.state === 'current' ? colors.accent : 'transparent',
          },
        ]}
      >
        <View style={[styles.circle, { backgroundColor: palette.bg }]}>
          <Text style={[styles.icon, { color: palette.text }]}>{nodeIcon(node)}</Text>
        </View>
      </Animated.View>
      <Text style={[styles.label, disabled && styles.labelLocked]} numberOfLines={2}>
        {node.moduleTitle}
      </Text>
      {node.stars > 0 ? <StarRow count={node.stars} /> : <View style={styles.starsPlaceholder} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    alignItems: 'center',
    width: NODE_SIZE + 48,
    gap: spacing.xs,
  },
  pressed: { opacity: 0.85 },
  ring: {
    padding: 4,
    borderRadius: radius.pill,
    borderWidth: 3,
    shadowOpacity: 0.45,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 4,
  },
  circle: {
    width: NODE_SIZE,
    height: NODE_SIZE,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: { fontSize: 26, fontWeight: '800' },
  label: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 16,
  },
  labelLocked: { color: colors.textMuted },
  stars: { flexDirection: 'row', gap: 2 },
  star: { fontSize: 11 },
  starOn: { color: colors.star },
  starOff: { color: colors.starEmpty },
  starsPlaceholder: { height: 14 },
});
