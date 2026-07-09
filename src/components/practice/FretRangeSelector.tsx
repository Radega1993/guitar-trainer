import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, radius, spacing } from '../../theme';

export default function FretRangeSelector({
  min,
  max,
  onChange,
}: {
  min: number;
  max: number;
  onChange: (next: { min: number; max: number }) => void;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.inputWrap}>
        <Text style={styles.label}>Traste mín</Text>
        <TextInput
          value={String(min)}
          onChangeText={(v) => onChange({ min: Number(v) || 0, max })}
          keyboardType="numeric"
          style={styles.input}
        />
      </View>
      <View style={styles.inputWrap}>
        <Text style={styles.label}>Traste máx</Text>
        <TextInput
          value={String(max)}
          onChangeText={(v) => onChange({ min, max: Number(v) || min })}
          keyboardType="numeric"
          style={styles.input}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.sm },
  inputWrap: { flex: 1, gap: 4 },
  label: { color: colors.textMuted, fontSize: 12 },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    color: colors.text,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: colors.surfaceAlt,
  },
});

