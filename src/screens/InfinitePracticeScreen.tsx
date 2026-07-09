import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import PrimaryButton from '../components/common/PrimaryButton';
import { RootStackParamList } from '../navigation/types';
import { colors, radius, spacing } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'InfinitePractice'>;

export default function InfinitePracticeScreen({ navigation }: Props) {
  const [speed, setSpeed] = useState<'slow' | 'normal' | 'fast'>('normal');

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Modo práctica infinita</Text>
        <Text style={styles.desc}>
          Entrena sin límite de rondas. Puedes variar velocidad y repetir lectura continua.
        </Text>

        <View style={styles.card}>
          <Text style={styles.section}>Velocidad</Text>
          <View style={styles.row}>
            <PrimaryButton
              label="Lenta"
              variant={speed === 'slow' ? 'primary' : 'secondary'}
              onPress={() => setSpeed('slow')}
              style={styles.rowButton}
            />
            <PrimaryButton
              label="Normal"
              variant={speed === 'normal' ? 'primary' : 'secondary'}
              onPress={() => setSpeed('normal')}
              style={styles.rowButton}
            />
            <PrimaryButton
              label="Rápida"
              variant={speed === 'fast' ? 'primary' : 'secondary'}
              onPress={() => setSpeed('fast')}
              style={styles.rowButton}
            />
          </View>
        </View>

        <PrimaryButton
          label="Comenzar práctica infinita"
          onPress={() =>
            navigation.navigate('Exercise', {
              sessionMode: 'infinite',
              sourceId: speed,
            })
          }
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, gap: spacing.md },
  title: { color: colors.text, fontSize: 24, fontWeight: '800' },
  desc: { color: colors.textMuted, fontSize: 15, lineHeight: 22 },
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    padding: spacing.md,
    gap: spacing.sm,
  },
  section: { color: colors.text, fontSize: 16, fontWeight: '700' },
  row: { flexDirection: 'row', gap: spacing.sm },
  rowButton: { flex: 1 },
});
