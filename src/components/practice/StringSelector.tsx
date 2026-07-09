import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '../../theme';

export default function StringSelector({
  value,
  onChange,
}: {
  value: number[];
  onChange: (strings: number[]) => void;
}) {
  const toggle = (s: number) => {
    const next = value.includes(s) ? value.filter((x) => x !== s) : [...value, s].sort((a, b) => a - b);
    onChange(next);
  };
  return (
    <View style={styles.row}>
      {[1, 2, 3, 4, 5, 6].map((s) => (
        <Pressable
          key={s}
          onPress={() => toggle(s)}
          style={[styles.chip, value.includes(s) && styles.chipOn]}
        >
          <Text style={[styles.label, value.includes(s) && styles.labelOn]}>{s}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: colors.surfaceAlt,
  },
  chipOn: { borderColor: colors.accent, backgroundColor: '#5a4421' },
  label: { color: colors.textMuted, fontWeight: '700' },
  labelOn: { color: colors.accent },
});

