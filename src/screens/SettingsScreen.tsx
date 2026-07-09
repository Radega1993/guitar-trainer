import React from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NoteNamingSelector from '../components/common/NoteNamingSelector';
import { useSettingsStore } from '../settings/store';
import { formatAmericanRawName } from '../settings/noteFormat';
import { colors, radius, spacing } from '../theme';

export default function SettingsScreen() {
  const noteNamingSystem = useSettingsStore((s) => s.noteNamingSystem);
  const setNoteNamingSystem = useSettingsStore((s) => s.setNoteNamingSystem);
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const playCorrectNoteAfterAnswer = useSettingsStore((s) => s.playCorrectNoteAfterAnswer);
  const feedbackSoundsEnabled = useSettingsStore((s) => s.feedbackSoundsEnabled);
  const fretTapSoundEnabled = useSettingsStore((s) => s.fretTapSoundEnabled);
  const setSoundEnabled = useSettingsStore((s) => s.setSoundEnabled);
  const setPlayCorrectNoteAfterAnswer = useSettingsStore((s) => s.setPlayCorrectNoteAfterAnswer);
  const setFeedbackSoundsEnabled = useSettingsStore((s) => s.setFeedbackSoundsEnabled);
  const setFretTapSoundEnabled = useSettingsStore((s) => s.setFretTapSoundEnabled);

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

        <View style={styles.card}>
          <Text style={styles.title}>Sonido</Text>
          <ToggleRow
            label="Activar sonidos"
            value={soundEnabled}
            onChange={setSoundEnabled}
          />
          <ToggleRow
            label="Nota correcta tras responder"
            value={playCorrectNoteAfterAnswer}
            onChange={setPlayCorrectNoteAfterAnswer}
            disabled={!soundEnabled}
          />
          <ToggleRow
            label="Feedback acierto/error"
            value={feedbackSoundsEnabled}
            onChange={setFeedbackSoundsEnabled}
            disabled={!soundEnabled}
          />
          <ToggleRow
            label="Sonido al pulsar mástil"
            value={fretTapSoundEnabled}
            onChange={setFretTapSoundEnabled}
            disabled={!soundEnabled}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ToggleRow({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <View style={styles.toggleRow}>
      <Text style={[styles.toggleLabel, disabled && styles.toggleLabelDisabled]}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onChange}
        disabled={disabled}
        trackColor={{ false: colors.surfaceAlt, true: colors.accent }}
        thumbColor="#ffffff"
      />
    </View>
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
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
  },
  toggleLabel: {
    color: colors.text,
    fontSize: 14,
    flex: 1,
  },
  toggleLabelDisabled: {
    color: colors.textMuted,
  },
});
