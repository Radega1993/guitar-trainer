import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import PrimaryButton from '../components/common/PrimaryButton';
import FretRangeSelector from '../components/practice/FretRangeSelector';
import NoteSelector from '../components/practice/NoteSelector';
import PracticeFilterSection from '../components/practice/PracticeFilterSection';
import StringSelector from '../components/practice/StringSelector';
import { INITIAL_STUDY_BLOCKS } from '../data/curriculum';
import { defaultPracticeConfig, normalizePracticeConfig, PracticeConfig } from '../engine/practiceConfig';
import { RootStackParamList } from '../navigation/types';
import { useSettingsStore } from '../settings/store';
import { colors, spacing } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'PracticeSetup'>;

export default function PracticeSetupScreen({ navigation }: Props) {
  const noteNamingSystem = useSettingsStore((s) => s.noteNamingSystem);
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const [config, setConfig] = useState<PracticeConfig>({
    ...defaultPracticeConfig,
    notationSystem: noteNamingSystem,
    soundEnabled,
  });

  const levels = useMemo(() => INITIAL_STUDY_BLOCKS.flatMap((b) => b.levels), []);

  const toggleBlock = (blockId: string) =>
    setConfig((prev) => ({
      ...prev,
      blockIds: prev.blockIds.includes(blockId)
        ? prev.blockIds.filter((id) => id !== blockId)
        : [...prev.blockIds, blockId],
    }));

  const toggleLevel = (levelId: string) =>
    setConfig((prev) => ({
      ...prev,
      levelIds: prev.levelIds.includes(levelId)
        ? prev.levelIds.filter((id) => id !== levelId)
        : [...prev.levelIds, levelId],
    }));

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <PracticeFilterSection title="Bloques">
          {INITIAL_STUDY_BLOCKS.map((b) => (
            <PrimaryButton
              key={b.id}
              label={b.title}
              variant={config.blockIds.includes(b.id) ? 'primary' : 'secondary'}
              onPress={() => toggleBlock(b.id)}
            />
          ))}
        </PracticeFilterSection>

        <PracticeFilterSection title="Niveles">
          {levels.map((l) => (
            <PrimaryButton
              key={l.id}
              label={l.title}
              variant={config.levelIds.includes(l.id) ? 'primary' : 'secondary'}
              onPress={() => toggleLevel(l.id)}
            />
          ))}
        </PracticeFilterSection>

        <PracticeFilterSection title="Cuerdas">
          <StringSelector
            value={config.strings}
            onChange={(strings) => setConfig((prev) => ({ ...prev, strings }))}
          />
        </PracticeFilterSection>

        <PracticeFilterSection title="Notas concretas">
          <NoteSelector
            value={config.notePool}
            onChange={(notePool) => setConfig((prev) => ({ ...prev, notePool }))}
          />
        </PracticeFilterSection>

        <PracticeFilterSection title="Trastes">
          <FretRangeSelector
            min={config.fretMin}
            max={config.fretMax}
            onChange={({ min, max }) => setConfig((prev) => ({ ...prev, fretMin: min, fretMax: max }))}
          />
        </PracticeFilterSection>

        <PracticeFilterSection title="Opciones">
          <ToggleRow label="Con tiempo" value={config.timedMode} onChange={(v) => setConfig((p) => ({ ...p, timedMode: v }))} />
          <ToggleRow label="Con animación" value={config.animated} onChange={(v) => setConfig((p) => ({ ...p, animated: v }))} />
          <ToggleRow label="Con sonido" value={config.soundEnabled} onChange={(v) => setConfig((p) => ({ ...p, soundEnabled: v }))} />
          <ToggleRow label="Solo notas falladas" value={config.onlyFailedNotes} onChange={(v) => setConfig((p) => ({ ...p, onlyFailedNotes: v }))} />
          <ToggleRow label="Todas las aprendidas" value={config.includeLearnedNotes} onChange={(v) => setConfig((p) => ({ ...p, includeLearnedNotes: v }))} />
          <ToggleRow label="Guardar estadísticas al parar" value={config.saveStatsOnStop} onChange={(v) => setConfig((p) => ({ ...p, saveStatsOnStop: v }))} />
        </PracticeFilterSection>

        <PracticeFilterSection title="Velocidad">
          <View style={styles.row}>
            {(['slow', 'normal', 'fast'] as const).map((speed) => (
              <PrimaryButton
                key={speed}
                label={speed === 'slow' ? 'Lenta' : speed === 'normal' ? 'Normal' : 'Rápida'}
                variant={config.speed === speed ? 'primary' : 'secondary'}
                onPress={() => setConfig((p) => ({ ...p, speed }))}
                style={styles.flex}
              />
            ))}
          </View>
        </PracticeFilterSection>

        <PrimaryButton
          label="Iniciar práctica"
          onPress={() =>
            navigation.navigate('PracticeSession', {
              config: normalizePracticeConfig(config),
            })
          }
        />
      </ScrollView>
    </SafeAreaView>
  );
}

function ToggleRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <View style={styles.toggleRow}>
      <Text style={styles.toggleLabel}>{label}</Text>
      <Switch value={value} onValueChange={onChange} />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, gap: spacing.md },
  row: { flexDirection: 'row', gap: spacing.sm },
  flex: { flex: 1 },
  toggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  toggleLabel: { color: colors.text, fontSize: 14 },
});

