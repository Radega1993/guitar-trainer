import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import PrimaryButton from '../components/common/PrimaryButton';
import { StudyBlock } from '../data/curriculum';
import { resolveCurriculumSource } from '../data/curriculum/loader';
import { RootStackParamList } from '../navigation/types';
import { useProgress } from '../storage/ProgressContext';
import { colors, radius, spacing } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'StudyBlock'>;

export default function StudyBlockScreen({ route, navigation }: Props) {
  const { isStudyLevelUnlocked, isStudyBlockUnlocked } = useProgress();
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

  const block = useMemo(
    () => blocks.find((item) => item.id === route.params.blockId),
    [blocks, route.params.blockId]
  );

  if (!block) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.content}>
          <Text style={styles.title}>Bloque no encontrado</Text>
          <PrimaryButton label="Volver" onPress={() => navigation.goBack()} />
        </View>
      </SafeAreaView>
    );
  }

  if (!isStudyBlockUnlocked(block.id)) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.content}>
          <Text style={styles.title}>Bloque bloqueado</Text>
          <Text style={styles.desc}>Completa el bloque anterior para continuar.</Text>
          <PrimaryButton label="Volver" onPress={() => navigation.goBack()} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Text style={styles.title}>{block.title}</Text>
          <Text style={styles.desc}>{block.description}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.section}>Incluye niveles</Text>
          {block.levels.map((level) => (
            <View key={level.id} style={styles.levelRow}>
              <View style={styles.blockInfo}>
                <Text style={styles.item}>• {level.title}</Text>
                <Text style={styles.blockText}>{level.goal}</Text>
              </View>
              <PrimaryButton
                label="Jugar"
                variant="secondary"
                disabled={!isStudyLevelUnlocked(level.id)}
                onPress={() =>
                  navigation.navigate('Exercise', {
                    sessionMode: 'level',
                    sourceId: level.levelRefIds[0],
                    levelId: level.levelRefIds[0],
                    studyLevelId: level.id,
                  })
                }
                style={styles.blockButton}
              />
            </View>
          ))}
        </View>

        <PrimaryButton
          label="Iniciar bloque"
          onPress={() =>
            navigation.navigate('Exercise', {
              sessionMode: 'block',
              sourceId: block.id,
            })
          }
        />
        {block.blockExam ? (
          <PrimaryButton
            label="Examen del bloque"
            variant="secondary"
            onPress={() =>
              navigation.navigate('Exercise', {
                sessionMode: 'block',
                sourceId: `exam:${block.id}`,
              })
            }
          />
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, gap: spacing.md },
  hero: { gap: spacing.sm },
  title: { color: colors.text, fontSize: 24, fontWeight: '800' },
  desc: { color: colors.textMuted, fontSize: 15, lineHeight: 22 },
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    padding: spacing.md,
    gap: spacing.xs,
  },
  section: { color: colors.text, fontSize: 16, fontWeight: '700' },
  item: { color: colors.textMuted, fontSize: 14 },
  levelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  blockInfo: {
    flex: 1,
    gap: 2,
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
});
