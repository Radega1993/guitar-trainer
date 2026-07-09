import React, { useState } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import Svg, { G, Line, Path, Ellipse, Rect, Text as SvgText } from 'react-native-svg';
import { NoteName } from '../domain/notes';
import { staffStep, MIDDLE_STEP } from '../domain/staff';
import { ReadingPhase } from '../engine/readingPace';
import { formatNoteName } from '../settings/noteFormat';
import { useSettingsStore } from '../settings/store';
import { colors } from '../theme';
import { G_CLEF_PATH } from './gClefPath';
import AnimatedStaffNote from './AnimatedStaffNote';

export interface StaffProps {
  note: NoteName | null;
  showName?: boolean;
  height?: number;
  animatedQueue?: {
    id: string;
    note: NoteName;
    isActive: boolean;
    phase: ReadingPhase;
    speedMs: number;
    queueIndex: number;
    onArriveCenter?: () => void;
  }[];
}

const LINE_GAP = 15;
const NOTE_RX = 8.5;
const NOTE_RY = 6.5;

export default function Staff({
  note,
  showName = false,
  height = 190,
  animatedQueue,
}: StaffProps) {
  const noteNamingSystem = useSettingsStore((s) => s.noteNamingSystem);
  const [width, setWidth] = useState(0);

  const onLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    if (w !== width) setWidth(w);
  };

  const centerY = height / 2;
  const topLineY = centerY - 2 * LINE_GAP;
  const bottomLineY = centerY + 2 * LINE_GAP; // E4 line (step 0)
  const lineXStart = 12;

  // G clef sizing
  const clefHeight = height * 0.86;
  const clefScale = clefHeight / 512;
  const clefX = 16;
  const clefY = centerY - clefHeight / 2;

  const yForStep = (step: number) => bottomLineY - step * (LINE_GAP / 2);

  const noteAreaStart = clefX + 512 * clefScale + 12;
  const noteAreaEnd = width - 16;
  const noteAreaWidth = Math.max(0, noteAreaEnd - noteAreaStart);
  const readCenterX = noteAreaStart + noteAreaWidth * 0.42;
  const queueSpacing = Math.max(26, (noteAreaEnd - readCenterX - 12) / 4);
  const entryX = width + 26;

  const step = note ? staffStep(note) : 0;
  const noteY = yForStep(step);

  const ledgerLines: number[] = [];
  if (note) {
    for (let s = -2; s >= step; s -= 2) ledgerLines.push(s);
    for (let s = 10; s <= step; s += 2) ledgerLines.push(s);
  }

  const stemUp = step < MIDDLE_STEP;
  const stemX = stemUp ? readCenterX + NOTE_RX - 1 : readCenterX - NOTE_RX + 1;
  const stemY2 = stemUp ? noteY - 3.2 * LINE_GAP : noteY + 3.2 * LINE_GAP;

  return (
    <View style={[styles.container, { height }]} onLayout={onLayout}>
      {width > 0 && (
        <Svg width={width} height={height}>
          {/* Staff lines */}
          {[0, 1, 2, 3, 4].map((i) => (
            <Line
              key={`staffline-${i}`}
              x1={lineXStart}
              y1={topLineY + i * LINE_GAP}
              x2={width - 12}
              y2={topLineY + i * LINE_GAP}
              stroke={colors.textMuted}
              strokeWidth={1.2}
            />
          ))}

          {/* Treble clef */}
          <G transform={`translate(${clefX}, ${clefY}) scale(${clefScale})`}>
            <Path d={G_CLEF_PATH} fill={colors.text} />
          </G>

          {!animatedQueue?.length && note && (
            <G>
              {/* Ledger lines */}
              {ledgerLines.map((s) => (
                <Line
                  key={`ledger-${s}`}
                  x1={readCenterX - NOTE_RX - 6}
                  y1={yForStep(s)}
                  x2={readCenterX + NOTE_RX + 6}
                  y2={yForStep(s)}
                  stroke={colors.textMuted}
                  strokeWidth={1.2}
                />
              ))}

              {/* Stem */}
              <Line
                x1={stemX}
                y1={noteY}
                x2={stemX}
                y2={stemY2}
                stroke={colors.text}
                strokeWidth={2}
              />

              {/* Note head */}
              <Ellipse
                cx={readCenterX}
                cy={noteY}
                rx={NOTE_RX}
                ry={NOTE_RY}
                fill={colors.text}
                transform={`rotate(-20 ${readCenterX} ${noteY})`}
              />

              {showName && (
                <SvgText
                  x={readCenterX}
                  y={height - 8}
                  fill={colors.accent}
                  fontSize={16}
                  fontWeight="700"
                  textAnchor="middle"
                >
                  {formatNoteName(note, noteNamingSystem)}
                </SvgText>
              )}
            </G>
          )}

          {!!animatedQueue?.length && (
            <Rect
              x={readCenterX - 14}
              y={topLineY - 20}
              width={28}
              height={bottomLineY - topLineY + 40}
              fill={colors.text}
              opacity={0.12}
              rx={10}
            />
          )}

          {!!animatedQueue?.length &&
            animatedQueue.map((item) => (
              <AnimatedStaffNote
                key={item.id}
                note={item.note}
                isActive={item.isActive}
                phase={item.phase}
                speedMs={item.speedMs}
                centerX={readCenterX}
                queueX={readCenterX + item.queueIndex * queueSpacing}
                entryX={item.isActive ? entryX : readCenterX + item.queueIndex * queueSpacing}
                lineGap={LINE_GAP}
                bottomLineY={bottomLineY}
                onArriveCenter={item.onArriveCenter}
              />
            ))}

          {!!animatedQueue?.length && showName && animatedQueue[0] && (
            <SvgText
              x={readCenterX}
              y={height - 8}
              fill={colors.accent}
              fontSize={16}
              fontWeight="700"
              textAnchor="middle"
            >
              {formatNoteName(animatedQueue[0].note, noteNamingSystem)}
            </SvgText>
          )}
        </Svg>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});
