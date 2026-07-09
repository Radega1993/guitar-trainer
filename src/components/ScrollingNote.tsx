import React from 'react';
import { Ellipse, G, Line, Text as SvgText } from 'react-native-svg';
import Animated, { SharedValue, useAnimatedProps } from 'react-native-reanimated';
import { NoteName } from '../domain/notes';
import { MIDDLE_STEP, TOP_STEP } from '../domain/staff';
import { StaffNoteStatus } from '../engine/scrollingTimeline';
import { colors } from '../theme';

const AnimatedEllipse = Animated.createAnimatedComponent(Ellipse);
const AnimatedLine = Animated.createAnimatedComponent(Line);
const AnimatedSvgText = Animated.createAnimatedComponent(SvgText);

const NOTE_RX = 8.5;
const NOTE_RY = 6.5;
const LEDGER_HALF_WIDTH = 12;

function buildLedgerSteps(staffStepValue: number): number[] {
  const out: number[] = [];
  if (staffStepValue < 0) {
    for (let step = -2; step >= staffStepValue; step -= 2) out.push(step);
    return out;
  }
  if (staffStepValue > TOP_STEP) {
    for (let step = TOP_STEP + 2; step <= staffStepValue; step += 2) out.push(step);
  }
  return out;
}

function AnimatedLedgerLine({
  initialX,
  globalOffset,
  y,
  stroke,
}: {
  initialX: number;
  globalOffset: SharedValue<number>;
  y: number;
  stroke: string;
}) {
  const lineProps = useAnimatedProps(
    () => {
      const x = initialX - globalOffset.value;
      return {
        x1: x - LEDGER_HALF_WIDTH,
        x2: x + LEDGER_HALF_WIDTH,
      };
    },
    [initialX, globalOffset]
  );

  return <AnimatedLine animatedProps={lineProps} y1={y} y2={y} stroke={stroke} strokeWidth={2} />;
}

interface ScrollingNoteProps {
  note: NoteName;
  displayName?: string;
  initialX: number;
  staffStepValue: number;
  globalOffset: SharedValue<number>;
  lineGap: number;
  bottomLineY: number;
  status: StaffNoteStatus;
  showLabel?: boolean;
  labelY: number;
}

export default function ScrollingNote({
  note,
  displayName,
  initialX,
  staffStepValue,
  globalOffset,
  lineGap,
  bottomLineY,
  status,
  showLabel = false,
  labelY,
}: ScrollingNoteProps) {
  const noteY = bottomLineY - staffStepValue * (lineGap / 2);
  const stemUp = staffStepValue < MIDDLE_STEP;
  const ledgerSteps = buildLedgerSteps(staffStepValue);

  const isActive = status === 'active';
  const isFuture = status === 'upcoming' || status === 'moving';
  const isWrong = status === 'wrong';
  const isCorrect = status === 'correct';

  const fill = isWrong ? colors.wrong : isCorrect ? colors.correct : isActive ? colors.text : '#d0cbc2';
  const stroke = isActive ? colors.text : colors.textMuted;
  const opacity = isActive ? 1 : isFuture ? 0.55 : 0.35;

  const headProps = useAnimatedProps(
    () => ({
      cx: initialX - globalOffset.value,
    }),
    [initialX, globalOffset]
  );

  const stemProps = useAnimatedProps(
    () => {
      const x = initialX - globalOffset.value;
      return {
        x1: stemUp ? x + NOTE_RX - 1 : x - NOTE_RX + 1,
        x2: stemUp ? x + NOTE_RX - 1 : x - NOTE_RX + 1,
      };
    },
    [initialX, globalOffset, stemUp]
  );

  const xLabelProps = useAnimatedProps(
    () => ({
      x: initialX - globalOffset.value,
    }),
    [initialX, globalOffset]
  );

  return (
    <G opacity={opacity}>
      {ledgerSteps.map((step) => (
        <AnimatedLedgerLine
          key={`ledger-${step}`}
          initialX={initialX}
          globalOffset={globalOffset}
          y={bottomLineY - step * (lineGap / 2)}
          stroke={stroke}
        />
      ))}
      <AnimatedLine
        animatedProps={stemProps}
        y1={noteY}
        y2={stemUp ? noteY - 3.2 * lineGap : noteY + 3.2 * lineGap}
        stroke={stroke}
        strokeWidth={2}
      />
      <AnimatedEllipse
        animatedProps={headProps}
        cy={noteY}
        rx={NOTE_RX}
        ry={NOTE_RY}
        fill={fill}
        stroke={stroke}
        strokeWidth={1}
      />
      {showLabel && (
        <AnimatedSvgText
          animatedProps={xLabelProps}
          y={labelY}
          fill={colors.accent}
          fontSize={16}
          fontWeight="700"
          textAnchor="middle"
        >
          {displayName ?? ''}
        </AnimatedSvgText>
      )}
    </G>
  );
}
