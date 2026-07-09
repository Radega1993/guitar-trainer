import React, { useEffect } from 'react';
import { Easing } from 'react-native-reanimated';
import { Ellipse, G, Line } from 'react-native-svg';
import Animated, {
  runOnJS,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { NoteName } from '../domain/notes';
import { MIDDLE_STEP, staffStep } from '../domain/staff';
import { colors } from '../theme';
import { ReadingPhase } from '../engine/readingPace';

const AnimatedEllipse = Animated.createAnimatedComponent(Ellipse);
const AnimatedLine = Animated.createAnimatedComponent(Line);

export interface AnimatedStaffNoteProps {
  note: NoteName;
  isActive: boolean;
  phase: ReadingPhase;
  centerX: number;
  queueX: number;
  entryX: number;
  speedMs: number;
  lineGap: number;
  bottomLineY: number;
  onArriveCenter?: () => void;
}

const NOTE_RX = 8.5;
const NOTE_RY = 6.5;

export default function AnimatedStaffNote({
  note,
  isActive,
  phase,
  centerX,
  queueX,
  entryX,
  speedMs,
  lineGap,
  bottomLineY,
  onArriveCenter,
}: AnimatedStaffNoteProps) {
  const step = staffStep(note);
  const noteY = bottomLineY - step * (lineGap / 2);
  const stemUp = step < MIDDLE_STEP;
  const x = useSharedValue(isActive ? entryX : queueX);
  const hasArrived = useSharedValue(false);

  useEffect(() => {
    if (isActive && phase === 'approaching') {
      hasArrived.value = false;
      x.value = entryX;
      x.value = withTiming(
        centerX,
        {
          duration: speedMs,
          easing: Easing.out(Easing.cubic),
        },
        (finished) => {
          if (finished && !hasArrived.value) {
            hasArrived.value = true;
            if (onArriveCenter) runOnJS(onArriveCenter)();
          }
        }
      );
      return;
    }

    const target = isActive ? centerX : queueX;
    x.value = withTiming(target, {
      duration: isActive ? 220 : 280,
      easing: Easing.out(Easing.quad),
    });
  }, [isActive, phase, centerX, queueX, entryX, speedMs, onArriveCenter, x, hasArrived]);

  const headProps = useAnimatedProps(() => ({
    cx: x.value,
  }), [x]);

  const stemXProps = useAnimatedProps(() => ({
    x1: stemUp ? x.value + NOTE_RX - 1 : x.value - NOTE_RX + 1,
    x2: stemUp ? x.value + NOTE_RX - 1 : x.value - NOTE_RX + 1,
  }), [x, stemUp]);

  const opacity = isActive ? 1 : 0.55;

  return (
    <G opacity={opacity}>
      <AnimatedLine
        animatedProps={stemXProps}
        y1={noteY}
        y2={stemUp ? noteY - 3.2 * lineGap : noteY + 3.2 * lineGap}
        stroke={isActive ? colors.text : colors.textMuted}
        strokeWidth={2}
      />

      <AnimatedEllipse
        animatedProps={headProps}
        cy={noteY}
        rx={NOTE_RX}
        ry={NOTE_RY}
        fill={isActive ? colors.text : '#d0cbc2'}
        transform={`rotate(-20 ${centerX} ${noteY})`}
      />
    </G>
  );
}
