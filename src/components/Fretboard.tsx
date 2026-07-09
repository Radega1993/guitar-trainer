import React, { useState } from 'react';
import { LayoutChangeEvent, Pressable, StyleSheet, View } from 'react-native';
import Svg, { Circle, G, Line, Rect, Text as SvgText } from 'react-native-svg';
import { Position } from '../domain/fretboard';
import { midiToNote } from '../domain/notes';
import { OPEN_STRING_MIDI, STRING_COUNT } from '../domain/tuning';
import { formatNoteName } from '../settings/noteFormat';
import { useSettingsStore } from '../settings/store';
import { colors } from '../theme';

export type MarkerStatus = 'selected' | 'correct' | 'wrong';

export interface FretboardProps {
  displayFrets: number;
  onSelect?: (pos: Position) => void;
  marker?: { position: Position; status: MarkerStatus } | null;
  /** Optional string (1..6) to visually emphasise as the current target row. */
  highlightString?: number | null;
  disabled?: boolean;
  height?: number;
}

const LEFT_LABEL_W = 42;
const OPEN_ZONE_W = 34;
const RIGHT_PAD = 14;
const TOP_PAD = 26;
const STRING_GAP = 32;

const MARKER_COLOR: Record<MarkerStatus, string> = {
  selected: colors.accent,
  correct: colors.correct,
  wrong: colors.wrong,
};

const rowForString = (s: number) => STRING_COUNT - s; // string6 -> row 0 (top)

export default function Fretboard({
  displayFrets,
  onSelect,
  marker,
  highlightString,
  disabled,
  height,
}: FretboardProps) {
  const noteNamingSystem = useSettingsStore((s) => s.noteNamingSystem);
  const [width, setWidth] = useState(0);

  const FRET_NUMBER_SPACE = 24;
  const boardHeight =
    height ?? TOP_PAD * 2 + STRING_GAP * (STRING_COUNT - 1) + FRET_NUMBER_SPACE;

  const onLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    if (w !== width) setWidth(w);
  };

  const nutX = LEFT_LABEL_W + OPEN_ZONE_W;
  const boardW = Math.max(0, width - nutX - RIGHT_PAD);
  const fretW = displayFrets > 0 ? boardW / displayFrets : 0;

  const stringY = (row: number) => TOP_PAD + row * STRING_GAP;
  const fretLineX = (i: number) => nutX + i * fretW;
  const fretCenterX = (fret: number) =>
    fret === 0 ? LEFT_LABEL_W + OPEN_ZONE_W / 2 : nutX + (fret - 0.5) * fretW;

  const boardTop = stringY(0) - STRING_GAP / 2;
  const boardBottom = stringY(STRING_COUNT - 1) + STRING_GAP / 2;

  const inlayFrets = [3, 5, 7, 9].filter((f) => f <= displayFrets);

  const stringLabels = OPEN_STRING_MIDI.map((midi) =>
    formatNoteName(midiToNote(midi), noteNamingSystem).replace(' / ', '/')
  );

  return (
    <View style={[styles.container, { height: boardHeight }]} onLayout={onLayout}>
      {width > 0 && (
        <>
          <Svg width={width} height={boardHeight}>
            {/* Fretboard wood */}
            <Rect
              x={nutX}
              y={boardTop}
              width={boardW}
              height={boardBottom - boardTop}
              fill={colors.wood}
              rx={4}
            />

            {/* Highlighted target string band */}
            {highlightString != null && (
              <Rect
                x={LEFT_LABEL_W}
                y={stringY(rowForString(highlightString)) - STRING_GAP / 2}
                width={width - LEFT_LABEL_W - RIGHT_PAD}
                height={STRING_GAP}
                fill={colors.accent}
                opacity={0.12}
                rx={6}
              />
            )}

            {/* Inlay dots */}
            {inlayFrets.map((f) => (
              <Circle
                key={`inlay-${f}`}
                cx={fretCenterX(f)}
                cy={(boardTop + boardBottom) / 2}
                r={5}
                fill={colors.woodDark}
              />
            ))}

            {/* Fret wires */}
            {Array.from({ length: displayFrets }, (_, i) => i + 1).map((i) => (
              <Line
                key={`fret-${i}`}
                x1={fretLineX(i)}
                y1={boardTop}
                x2={fretLineX(i)}
                y2={boardBottom}
                stroke={colors.fretMetal}
                strokeWidth={2}
              />
            ))}

            {/* Nut */}
            <Line
              x1={nutX}
              y1={boardTop}
              x2={nutX}
              y2={boardBottom}
              stroke={colors.nut}
              strokeWidth={6}
              strokeLinecap="round"
            />

            {/* Strings */}
            {Array.from({ length: STRING_COUNT }, (_, row) => {
              const s = STRING_COUNT - row; // row 0 -> string 6
              const y = stringY(row);
              return (
                <G key={`string-${s}`}>
                  <Line
                    x1={LEFT_LABEL_W}
                    y1={y}
                    x2={width - RIGHT_PAD}
                    y2={y}
                    stroke={colors.string}
                    strokeWidth={0.6 + (s / STRING_COUNT) * 2.2}
                  />
                  <SvgText
                    x={LEFT_LABEL_W / 2}
                    y={y + 4}
                    fill={colors.textMuted}
                    fontSize={10}
                    fontWeight="600"
                    textAnchor="middle"
                  >
                    {stringLabels[s - 1]}
                  </SvgText>
                </G>
              );
            })}

            {/* Fret numbers */}
            {Array.from({ length: displayFrets + 1 }, (_, f) => f).map((f) => (
              <SvgText
                key={`fretnum-${f}`}
                x={fretCenterX(f)}
                y={boardBottom + 16}
                fill={colors.textMuted}
                fontSize={11}
                textAnchor="middle"
              >
                {f}
              </SvgText>
            ))}

            {/* Selected / feedback marker */}
            {marker && (
              <G>
                <Circle
                  cx={fretCenterX(marker.position.fret)}
                  cy={stringY(rowForString(marker.position.string))}
                  r={13}
                  fill={MARKER_COLOR[marker.status]}
                  stroke={colors.text}
                  strokeWidth={1.5}
                />
                <SvgText
                  x={fretCenterX(marker.position.fret)}
                  y={stringY(rowForString(marker.position.string)) + 4}
                  fill="#ffffff"
                  fontSize={11}
                  fontWeight="700"
                  textAnchor="middle"
                >
                  {marker.position.fret}
                </SvgText>
              </G>
            )}
          </Svg>

          {/* Touch targets overlaid on the SVG using the same geometry */}
          {!disabled &&
            Array.from({ length: STRING_COUNT }, (_, row) => STRING_COUNT - row).map((s) =>
              Array.from({ length: displayFrets + 1 }, (_, f) => f).map((f) => {
                const left = f === 0 ? LEFT_LABEL_W : nutX + (f - 1) * fretW;
                const w = f === 0 ? OPEN_ZONE_W : fretW;
                const top = stringY(rowForString(s)) - STRING_GAP / 2;
                return (
                  <Pressable
                    key={`tap-${s}-${f}`}
                    onPress={() => onSelect?.({ string: s, fret: f })}
                    style={{
                      position: 'absolute',
                      left,
                      top,
                      width: w,
                      height: STRING_GAP,
                    }}
                  />
                );
              })
            )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});
