import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { NoteNamingSystem } from '../settings/types';
import { colors, radius, spacing } from '../theme';

interface NoteNamingSelectorProps {
  value: NoteNamingSystem;
  onChange: (value: NoteNamingSystem) => void;
}

const options: { id: NoteNamingSystem; label: string; sample: string }[] = [
  { id: 'american', label: 'Formato americano', sample: 'C D E F G A B' },
  { id: 'latin', label: 'Formato latino', sample: 'Do Re Mi Fa Sol La Si' },
  { id: 'both', label: 'Ambos formatos', sample: 'Sol / G' },
];

export default function NoteNamingSelector({ value, onChange }: NoteNamingSelectorProps) {
  return (
    <View style={styles.wrap}>
      {options.map((option) => {
        const active = option.id === value;
        return (
          <Pressable
            key={option.id}
            onPress={() => onChange(option.id)}
            style={[styles.option, active && styles.optionActive]}
          >
            <Text style={[styles.title, active && styles.titleActive]}>{option.label}</Text>
            <Text style={[styles.sample, active && styles.sampleActive]}>{option.sample}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.sm,
  },
  option: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    padding: spacing.md,
    gap: 4,
  },
  optionActive: {
    borderColor: colors.accent,
    backgroundColor: colors.surfaceAlt,
  },
  title: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  titleActive: {
    color: colors.accent,
  },
  sample: {
    color: colors.textMuted,
    fontSize: 13,
  },
  sampleActive: {
    color: colors.text,
  },
});
