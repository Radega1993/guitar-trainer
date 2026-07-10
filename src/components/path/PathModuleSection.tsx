import React, { useState } from 'react';
import { LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';
import Svg, { Line } from 'react-native-svg';
import { PathLessonNode, PathModuleSection } from '../../data/curriculum/learningPath';
import PathLessonDot from './PathLessonDot';
import { colors, radius, spacing } from '../../theme';

interface PathModuleSectionViewProps {
  section: PathModuleSection;
  mapWidth: number;
  sectionOffsetY: number;
  onLessonPress: (lesson: PathLessonNode) => void;
  onLessonLayout?: (lessonId: string, y: number) => void;
  hideHeader?: boolean;
}

const ROW_HEIGHT = 108;
const DOT_SIZE = 52;
const DOT_TOP = 2;
const DOT_CENTER_Y = DOT_TOP + DOT_SIZE / 2 + 3;
const LEFT_RATIO = 0.28;
const RIGHT_RATIO = 0.72;

function dotX(side: 'left' | 'right', width: number) {
  return (side === 'left' ? LEFT_RATIO : RIGHT_RATIO) * width;
}

export default function PathModuleSectionView({
  section,
  mapWidth,
  sectionOffsetY,
  onLessonPress,
  onLessonLayout,
  hideHeader = false,
}: PathModuleSectionViewProps) {
  const mapHeight = section.lessons.length * ROW_HEIGHT;

  return (
    <View style={styles.section}>
      {section.blockLocked ? (
        <View style={styles.previewBanner}>
          <Text style={styles.previewBannerText}>
            Vista previa · {section.totalLessons} lecciones · completa bloques anteriores para jugar
          </Text>
        </View>
      ) : null}

      {!hideHeader ? (
        <View style={styles.header}>
          <Text style={styles.blockIndex}>{section.blockIndex}</Text>
          <View style={styles.headerText}>
            <Text style={styles.moduleTitle}>{section.moduleTitle}</Text>
            <Text style={styles.progress}>
              {section.blockLocked
                ? 'Bloqueado'
                : `${section.completedLessons}/${section.totalLessons} lecciones`}
            </Text>
          </View>
          {section.blockComplete ? <Text style={styles.doneBadge}>✓</Text> : null}
        </View>
      ) : (
        <Text style={styles.progressOnly}>
          {section.blockLocked
            ? `${section.totalLessons} lecciones en este módulo`
            : `${section.completedLessons}/${section.totalLessons} lecciones completadas`}
        </Text>
      )}

      <View style={[styles.map, { height: mapHeight }]}>
        {mapWidth > 0 && section.lessons.length > 1 ? (
          <Svg
            width={mapWidth}
            height={mapHeight}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          >
            {section.lessons.map((lesson, index) => {
              if (index === 0) return null;
              const prev = section.lessons[index - 1];
              const x1 = dotX(prev.side, mapWidth);
              const y1 = (index - 1) * ROW_HEIGHT + DOT_CENTER_Y;
              const x2 = dotX(lesson.side, mapWidth);
              const y2 = index * ROW_HEIGHT + DOT_CENTER_Y;
              const active = lesson.state !== 'locked';

              return (
                <React.Fragment key={`seg-${lesson.id}`}>
                  <Line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={colors.border}
                    strokeWidth={6}
                    strokeLinecap="round"
                    opacity={0.45}
                  />
                  <Line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={active ? colors.primary : colors.locked}
                    strokeWidth={4}
                    strokeLinecap="round"
                    opacity={active ? 1 : 0.35}
                  />
                </React.Fragment>
              );
            })}
          </Svg>
        ) : null}

        {section.lessons.map((lesson, index) => {
          const left = mapWidth > 0 ? dotX(lesson.side, mapWidth) - (DOT_SIZE + 56) / 2 : 0;

          return (
            <View
              key={lesson.id}
              style={[styles.row, { height: ROW_HEIGHT }]}
              onLayout={(e) =>
                onLessonLayout?.(lesson.id, sectionOffsetY + index * ROW_HEIGHT + e.nativeEvent.layout.y)
              }
            >
              {mapWidth > 0 ? (
                <View style={[styles.dotSlot, { left, top: DOT_TOP }]}>
                  <PathLessonDot
                    lesson={lesson}
                    onPress={onLessonPress}
                    preview={section.blockLocked && lesson.levelType === 'theory'}
                  />
                </View>
              ) : null}
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
  },
  previewBanner: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  previewBannerText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  blockIndex: {
    width: 28,
    height: 28,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceAlt,
    color: colors.accent,
    fontSize: 14,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 28,
    overflow: 'hidden',
  },
  headerText: { flex: 1, gap: 2 },
  moduleTitle: { color: colors.text, fontSize: 16, fontWeight: '800' },
  progress: { color: colors.textMuted, fontSize: 12 },
  progressOnly: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  doneBadge: { color: colors.correct, fontSize: 20, fontWeight: '800' },
  map: { position: 'relative', width: '100%' },
  row: { position: 'relative', width: '100%' },
  dotSlot: { position: 'absolute', alignItems: 'center' },
});
