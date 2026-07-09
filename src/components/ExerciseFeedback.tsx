import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PrimaryButton from './PrimaryButton';
import { colors, radius, spacing } from '../theme';

interface ExerciseFeedbackProps {
  visible: boolean;
  ok: boolean;
  message: string;
  pauseOnWrongAnswer?: boolean;
  onContinue?: () => void;
}

export default function ExerciseFeedback({
  visible,
  ok,
  message,
  pauseOnWrongAnswer = false,
  onContinue,
}: ExerciseFeedbackProps) {
  if (!visible) return <View style={styles.placeholder} />;
  const showContinue = !ok && pauseOnWrongAnswer;
  return (
    <View style={styles.wrap}>
      <View style={[styles.banner, { backgroundColor: ok ? colors.correct : colors.wrong }]}>
        <Text style={styles.text}>{message}</Text>
      </View>
      {showContinue && onContinue ? (
        <PrimaryButton label="Continuar" onPress={onContinue} style={styles.button} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    height: 56,
    marginVertical: spacing.md,
  },
  wrap: {
    marginVertical: spacing.md,
    gap: spacing.sm,
  },
  banner: {
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  text: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  button: {
    alignSelf: 'center',
    minWidth: 180,
  },
});
