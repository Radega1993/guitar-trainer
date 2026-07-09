import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { StatsTimeFilter } from '../../analytics/types';
import { colors, radius, spacing } from '../../theme';

interface StatsFilterChipsProps {
  value: StatsTimeFilter;
  onChange: (value: StatsTimeFilter) => void;
}

const options: { value: StatsTimeFilter; label: string }[] = [
  { value: 7, label: '7d' },
  { value: 14, label: '14d' },
  { value: 0, label: 'Todo' },
];

export default function StatsFilterChips({ value, onChange }: StatsFilterChipsProps) {
  return (
    <View style={styles.row}>
      {options.map((option) => {
        const active = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            style={[styles.chip, active && styles.chipActive]}
          >
            <Text style={[styles.label, active && styles.labelActive]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  chip: {
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  chipActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  label: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  labelActive: {
    color: colors.background,
  },
});
