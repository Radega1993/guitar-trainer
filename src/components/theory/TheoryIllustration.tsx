import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { getTheoryImageModule } from '../../data/curriculum/theoryImageAssets';
import { getTheorySvg } from '../../data/curriculum/theorySvgContent';
import TheoryExerciseVisual from './TheoryExerciseVisual';
import TheoryImagePreview from './TheoryImagePreview';
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
  const customExerciseVariant =
    imageKey === 'exercise-scrolling-preview'
      ? 'scrolling'
      : imageKey === 'exercise-flow-preview'
      ? 'flow'
      : null;
  const [previewOpen, setPreviewOpen] = useState(false);
  const png = getTheoryImageModule(imageKey);
  const xml = getTheorySvg(imageKey);
  const emoji = FALLBACK_EMOJI[imageKey] ?? '📖';
  const zoomable = Boolean(png || xml);

  return (
    <>
      <View style={styles.wrap}>
        {customExerciseVariant ? (
          <TheoryExerciseVisual variant={customExerciseVariant} />
        ) : (
          <Pressable
            onPress={() => setPreviewOpen(true)}
            disabled={!zoomable}
            style={({ pressed }) => [styles.frame, zoomable && pressed ? styles.framePressed : null]}
            accessibilityRole={zoomable ? 'button' : undefined}
            accessibilityLabel={
              zoomable ? `${caption ?? 'Ilustración'}. Toca para ampliar` : caption
            }
          >
            {png ? (
              <Image source={png} style={styles.png} resizeMode="contain" accessibilityLabel={caption} />
            ) : xml ? (
              <SvgXml xml={xml} width="100%" height="100%" />
            ) : (
              <View style={styles.fallback}>
                <Text style={styles.emoji}>{emoji}</Text>
              </View>
            )}
            {zoomable ? (
              <View style={styles.zoomBadge}>
                <Text style={styles.zoomBadgeText}>Ampliar</Text>
              </View>
            ) : null}
          </Pressable>
        )}
        {caption ? <Text style={styles.caption}>{caption}</Text> : null}
        {attribution ? <Text style={styles.attribution}>{attribution}</Text> : null}
      </View>

      <TheoryImagePreview
        visible={previewOpen}
        onClose={() => setPreviewOpen(false)}
        png={png}
        svgXml={xml}
        caption={caption}
        attribution={attribution}
      />
    </>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.xs },
  frame: {
    height: 220,
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
  },
  framePressed: {
    opacity: 0.9,
  },
  zoomBadge: {
    position: 'absolute',
    right: spacing.sm,
    bottom: spacing.sm,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  zoomBadgeText: {
    color: colors.text,
    fontSize: 11,
    fontWeight: '700',
  },
  png: {
    width: '100%',
    height: '100%',
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
