import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GrowthIcon } from '../../data/curriculum/roadmap';
import { colors } from '../../theme';

const ICON_COLORS: Record<GrowthIcon, string> = {
  seed: '#84cc16',
  sprout: '#22c55e',
  tree: '#16a34a',
  mastery: '#f59e0b',
  virtuoso: '#a855f7',
};

interface StageGrowthIconProps {
  icon: GrowthIcon;
  emoji: string;
  size?: number;
  dimmed?: boolean;
}

export default function StageGrowthIcon({
  icon,
  emoji,
  size = 44,
  dimmed = false,
}: StageGrowthIconProps) {
  const ring = ICON_COLORS[icon];
  return (
    <View
      style={[
        styles.wrap,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderColor: dimmed ? colors.locked : ring,
          opacity: dimmed ? 0.45 : 1,
        },
      ]}
    >
      <Text style={[styles.emoji, { fontSize: size * 0.45 }]}>{emoji}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    backgroundColor: colors.surfaceAlt,
  },
  emoji: {
    textAlign: 'center',
  },
});
