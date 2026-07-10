import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Staff from '../staff/Staff';
import Fretboard from '../fretboard/Fretboard';
import { Position } from '../../domain/fretboard';
import { positionToMidi } from '../../domain/fretboard';
import { midiToNote } from '../../domain/notes';
import { colors, radius, spacing } from '../../theme';

interface TheoryExerciseVisualProps {
  variant: 'scrolling' | 'flow';
}

const DEMO_POSITIONS: Position[] = [
  { string: 1, fret: 0 }, // Mi
  { string: 1, fret: 1 }, // Fa
  { string: 1, fret: 3 }, // Sol
];

export default function TheoryExerciseVisual({ variant }: TheoryExerciseVisualProps) {
  const [demoIndex, setDemoIndex] = useState(0);

  useEffect(() => {
    if (variant !== 'scrolling') return;
    const timer = setInterval(() => {
      setDemoIndex((prev) => (prev + 1) % DEMO_POSITIONS.length);
    }, 1100);
    return () => clearInterval(timer);
  }, [variant]);

  const currentPosition = useMemo(() => DEMO_POSITIONS[demoIndex] ?? DEMO_POSITIONS[0], [demoIndex]);
  const currentNote = useMemo(() => midiToNote(positionToMidi(currentPosition)), [currentPosition]);

  if (variant === 'flow') {
    return (
      <View style={styles.flowWrap}>
        <Text style={styles.flowChip}>1. Veo la nota</Text>
        <Text style={styles.flowArrow}>{'->'}</Text>
        <Text style={styles.flowChip}>2. Digo su nombre</Text>
        <Text style={styles.flowArrow}>{'->'}</Text>
        <Text style={styles.flowChip}>3. La ubico en el mastil</Text>
        <Text style={styles.flowArrow}>{'->'}</Text>
        <Text style={styles.flowChip}>4. La toco</Text>
      </View>
    );
  }

  return (
    <View style={styles.scrollingWrap}>
      <Staff note={currentNote} height={160} showName />
      <Fretboard
        displayFrets={4}
        disabled
        highlightString={1}
        marker={{ position: currentPosition, status: 'selected' }}
        height={180}
      />
      <Text style={styles.demoHint}>{'Demo animada: Mi -> Fa -> Sol'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollingWrap: {
    gap: spacing.sm,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.lg,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  demoHint: {
    color: colors.textMuted,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
  },
  flowWrap: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.xs,
  },
  flowChip: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  flowArrow: {
    color: colors.accent,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '800',
  },
});
