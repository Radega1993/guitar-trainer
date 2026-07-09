import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import PrimaryButton from '../components/common/PrimaryButton';
import { getStudyBlock, resolveBlockLevels } from '../data/studyBlocks';
import { RootStackParamList } from '../navigation/types';
import { colors, radius, spacing } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'StudyBlock'>;

export default function StudyBlockScreen({ route, navigation }: Props) {
  const block = getStudyBlock(route.params.blockId);
  const levels = block ? resolveBlockLevels(block.id) : [];

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

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Text style={styles.title}>{block.title}</Text>
          <Text style={styles.desc}>{block.description}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.section}>Incluye niveles</Text>
          {levels.map((level) => (
            <Text key={level.id} style={styles.item}>
              • {level.name}
            </Text>
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
});
