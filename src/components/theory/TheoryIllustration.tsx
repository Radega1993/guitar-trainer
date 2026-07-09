import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { getTheorySvg } from '../../data/curriculum/theorySvgContent';
import { colors, radius, spacing } from '../../theme';

const FALLBACK_EMOJI: Record<string, string> = {
  'guitar-parts': '🎸',
  'guitar-strings': '🎵',
  'guitar-frets': '✋',
  'treble-staff': '🎼',
  'hand-fingers': '🖐️',
};

interface TheoryIllustrationProps {
  imageKey: string;
  caption?: string;
  attribution?: string;
}

export default function TheoryIllustration({ imageKey, caption, attribution }: TheoryIllustrationProps) {
  const xml = getTheorySvg(imageKey);
  const emoji = FALLBACK_EMOJI[imageKey] ?? '📖';

  return (
    <View style={styles.wrap}>
      <View style={styles.frame}>
        {xml ? (
          <SvgXml xml={xml} width="100%" height="100%" />
        ) : (
          <View style={styles.fallback}>
            <Text style={styles.emoji}>{emoji}</Text>
          </View>
        )}
      </View>
      {caption ? <Text style={styles.caption}>{caption}</Text> : null}
      {attribution ? <Text style={styles.attribution}>{attribution}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.xs },
  frame: {
    height: 200,
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
  },
  fallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceAlt,
  },
  emoji: { fontSize: 64 },
  caption: { color: colors.textMuted, fontSize: 13, lineHeight: 18 },
  attribution: { color: colors.textMuted, fontSize: 11, fontStyle: 'italic', opacity: 0.8 },
});
