import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NoteHotspot, StringHotspot } from '../../analytics/types';
import { formatAmericanRawName } from '../../settings/noteFormat';
import { useSettingsStore } from '../../settings/store';
import { colors, radius, spacing } from '../../theme';

interface ErrorHotspotsCardProps {
  notes: NoteHotspot[];
  strings: StringHotspot[];
}

function Row({
  left,
  right,
  meta,
}: {
  left: string;
  right: string;
  meta: string;
}) {
  return (
    <View style={styles.row}>
      <View style={{ flex: 1 }}>
        <Text style={styles.rowTitle}>{left}</Text>
        <Text style={styles.rowMeta}>{meta}</Text>
      </View>
      <Text style={styles.rowValue}>{right}</Text>
    </View>
  );
}

export default function ErrorHotspotsCard({ notes, strings }: ErrorHotspotsCardProps) {
  const noteNamingSystem = useSettingsStore((s) => s.noteNamingSystem);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Dónde fallas más</Text>

      <Text style={styles.section}>Notas</Text>
      {notes.length === 0 ? (
        <Text style={styles.empty}>Sin datos todavía.</Text>
      ) : (
        notes.map((n) => (
          <Row
            key={n.note}
            left={formatAmericanRawName(n.note, noteNamingSystem)}
            right={`${n.errorRatePct}%`}
            meta={`${n.wrongCount}/${n.attempts} errores`}
          />
        ))
      )}

      <Text style={[styles.section, { marginTop: spacing.md }]}>Cuerdas</Text>
      {strings.length === 0 ? (
        <Text style={styles.empty}>Sin datos todavía.</Text>
      ) : (
        strings.map((s) => (
          <Row
            key={s.string}
            left={`${s.string}.ª cuerda`}
            right={`${s.errorRatePct}%`}
            meta={`${s.wrongCount}/${s.attempts} errores`}
          />
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    padding: spacing.md,
    gap: spacing.xs,
  },
  title: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  section: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    gap: spacing.sm,
  },
  rowTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  rowMeta: {
    color: colors.textMuted,
    fontSize: 12,
  },
  rowValue: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  empty: {
    color: colors.textMuted,
    fontSize: 13,
  },
});
