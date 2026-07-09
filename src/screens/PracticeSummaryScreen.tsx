import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import PrimaryButton from '../components/common/PrimaryButton';
import { RootStackParamList } from '../navigation/types';
import { colors, radius, spacing } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'PracticeSummary'>;

export default function PracticeSummaryScreen({ route, navigation }: Props) {
  const { summary } = route.params;
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.card}>
        <Text style={styles.title}>Resumen de práctica</Text>
        <Text style={styles.item}>Duración: {summary.durationSec}s</Text>
        <Text style={styles.item}>Respuestas: {summary.attempts}</Text>
        <Text style={styles.item}>Correctas: {summary.correct}</Text>
        <Text style={styles.item}>Acierto: {Math.round(summary.accuracy * 100)}%</Text>
        <Text style={styles.item}>Tiempo medio: {Math.round(summary.avgResponseMs)}ms</Text>
        <Text style={styles.tip}>{summary.recommendation}</Text>
      </View>
      <PrimaryButton label="Nueva práctica" onPress={() => navigation.replace('PracticeSetup')} />
      <PrimaryButton label="Volver a inicio" variant="secondary" onPress={() => navigation.popToTop()} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background, padding: spacing.lg, gap: spacing.md },
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  title: { color: colors.text, fontSize: 22, fontWeight: '800' },
  item: { color: colors.text, fontSize: 15 },
  tip: { color: colors.accent, fontSize: 14, fontWeight: '700', marginTop: spacing.sm },
});

