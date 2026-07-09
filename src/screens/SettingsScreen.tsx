import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NoteNamingSelector from '../components/common/NoteNamingSelector';
import { useSettingsStore } from '../settings/store';
import { formatAmericanRawName } from '../settings/noteFormat';
import { colors, radius, spacing } from '../theme';

export default function SettingsScreen() {
  const noteNamingSystem = useSettingsStore((s) => s.noteNamingSystem);
  const setNoteNamingSystem = useSettingsStore((s) => s.setNoteNamingSystem);

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.title}>Nombres de notas</Text>
          <Text style={styles.desc}>
            Elige cómo mostrar las notas en ejercicios, feedback y estadísticas. Los cálculos
            internos se mantienen en sistema americano.
          </Text>
          <NoteNamingSelector value={noteNamingSystem} onChange={setNoteNamingSystem} />
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>Vista previa</Text>
          <Text style={styles.preview}>{formatAmericanRawName('G4', noteNamingSystem)}</Text>
          <Text style={styles.preview}>{formatAmericanRawName('C#5', noteNamingSystem)}</Text>
          <Text style={styles.preview}>{formatAmericanRawName('F3', noteNamingSystem)}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  desc: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 21,
  },
  preview: {
    color: colors.accent,
    fontSize: 17,
    fontWeight: '700',
  },
});
