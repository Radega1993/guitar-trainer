import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import PrimaryButton from '../components/common/PrimaryButton';
import { StudyBlock } from '../data/curriculum';
import { resolveCurriculumSource } from '../data/curriculum/loader';
import { useProgress } from '../storage/ProgressContext';
import { colors, radius, spacing } from '../theme';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const { isStudyBlockUnlocked } = useProgress();
  const [blocks, setBlocks] = useState<StudyBlock[]>([]);

  useEffect(() => {
    let mounted = true;
    void resolveCurriculumSource().then((data) => {
      if (mounted) setBlocks(data);
    });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Text style={styles.kicker}>Guitarra clásica</Text>
          <Text style={styles.title}>Guitar Trainer</Text>
          <Text style={styles.subtitle}>
            Aprende a leer notas en el pentagrama y a encontrarlas en el mástil.
          </Text>
        </View>

        <View style={styles.actions}>
          <PrimaryButton label="Jugar" onPress={() => navigation.navigate('LevelSelect')} />
          <PrimaryButton
            label="Práctica infinita"
            variant="secondary"
            onPress={() => navigation.navigate('PracticeSetup')}
          />
          <PrimaryButton
            label="Estadísticas"
            variant="secondary"
            onPress={() => navigation.navigate('Stats')}
          />
          <PrimaryButton
            label="Ajustes"
            variant="secondary"
            onPress={() => navigation.navigate('Settings')}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Cómo funciona</Text>
          <Text style={styles.cardText}>
            En cada ejercicio verás una nota en clave de sol. Tu tarea es tocarla en la
            cuerda indicada del mástil. Recibirás corrección inmediata y ganarás estrellas
            según tu precisión.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Bloques de estudio</Text>
          {blocks.map((block) => (
            <View key={block.id} style={styles.blockRow}>
              <View style={styles.blockInfo}>
                <Text style={styles.blockTitle}>{block.title}</Text>
                <Text style={styles.blockText}>{block.description}</Text>
                <Text style={styles.blockStatus}>
                  {isStudyBlockUnlocked(block.id) ? 'Desbloqueado' : 'Bloqueado'}
                </Text>
              </View>
              <PrimaryButton
                label="Abrir"
                variant="secondary"
                disabled={!isStudyBlockUnlocked(block.id)}
                onPress={() => navigation.navigate('StudyBlock', { blockId: block.id })}
                style={styles.blockButton}
              />
            </View>
          ))}
        </View>

        <View style={[styles.card, styles.noteCard]}>
          <Text style={styles.cardTitle}>Nota pedagógica</Text>
          <Text style={styles.cardText}>
            La guitarra es un instrumento transpositor: se escribe en clave de sol pero
            suena una octava más grave de lo que se lee. La secuencia de niveles se inspira
            en la progresión de los métodos clásicos de Sagreras, Sor y Aguado.
          </Text>
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
    gap: spacing.lg,
  },
  hero: {
    marginTop: spacing.xl,
    gap: spacing.xs,
  },
  kicker: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  title: {
    color: colors.text,
    fontSize: 40,
    fontWeight: '800',
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 16,
    lineHeight: 22,
  },
  actions: {
    gap: spacing.sm,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  noteCard: {
    backgroundColor: colors.surfaceAlt,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  cardText: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 21,
  },
  blockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  blockInfo: {
    flex: 1,
    gap: 2,
  },
  blockTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  blockText: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 18,
  },
  blockButton: {
    minWidth: 88,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  blockStatus: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '700',
  },
});
