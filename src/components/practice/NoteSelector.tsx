import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '../../theme';

const NOTES = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

export default function NoteSelector({
  value,
  onChange,
}: {
  value: string[];
  onChange: (notes: string[]) => void;
}) {
  const toggle = (n: string) => {
    const next = value.includes(n) ? value.filter((x) => x !== n) : [...value, n];
    onChange(next);
  };

  return (
    <View style={styles.row}>
      {NOTES.map((n) => (
        <Pressable key={n} onPress={() => toggle(n)} style={[styles.chip, value.includes(n) && styles.chipOn]}>
          <Text style={[styles.label, value.includes(n) && styles.labelOn]}>{n}</Text>
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

