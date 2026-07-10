import React from 'react';
import { Image, Modal, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';
import { colors, radius, spacing } from '../../theme';

interface TheoryImagePreviewProps {
  visible: boolean;
  onClose: () => void;
  png?: number;
  svgXml?: string;
  caption?: string;
  attribution?: string;
}

export default function TheoryImagePreview({
  visible,
  onClose,
  png,
  svgXml,
  caption,
  attribution,
}: TheoryImagePreviewProps) {
  const { width, height } = useWindowDimensions();
  const imageWidth = width - spacing.lg * 2;
  const imageHeight = height * 0.72;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
          <Pressable style={styles.content} onPress={() => undefined}>
            <View style={styles.header}>
              <Pressable
                onPress={onClose}
                style={styles.closeBtn}
                accessibilityRole="button"
                accessibilityLabel="Cerrar imagen ampliada"
              >
                <Text style={styles.closeText}>✕</Text>
              </Pressable>
            </View>

            <View style={styles.imageWrap}>
              {png ? (
                <Image
                  source={png}
                  style={{ width: imageWidth, height: imageHeight }}
                  resizeMode="contain"
                  accessibilityLabel={caption}
                />
              ) : svgXml ? (
                <SvgXml xml={svgXml} width={imageWidth} height={imageHeight} />
              ) : null}
            </View>

            {caption || attribution ? (
              <View style={styles.meta}>
                {caption ? <Text style={styles.caption}>{caption}</Text> : null}
                {attribution ? <Text style={styles.attribution}>{attribution}</Text> : null}
              </View>
            ) : null}
          </Pressable>
        </SafeAreaView>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.92)',
  },
  safe: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'flex-end',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  imageWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  meta: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    gap: spacing.xs,
  },
  caption: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  attribution: {
    color: colors.textMuted,
    fontSize: 12,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});
