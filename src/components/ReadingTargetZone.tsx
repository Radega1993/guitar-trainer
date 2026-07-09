import React from 'react';
import { Rect, Line } from 'react-native-svg';
import { colors } from '../theme';

interface ReadingTargetZoneProps {
  centerX: number;
  topLineY: number;
  bottomLineY: number;
  visible?: boolean;
}

export default function ReadingTargetZone({
  centerX,
  topLineY,
  bottomLineY,
  visible = true,
}: ReadingTargetZoneProps) {
  if (!visible) return null;
  return (
    <>
      <Rect
        x={centerX - 14}
        y={topLineY - 20}
        width={28}
        height={bottomLineY - topLineY + 40}
        fill={colors.text}
        opacity={0.12}
        rx={10}
      />
      <Line
        x1={centerX}
        y1={topLineY - 10}
        x2={centerX}
        y2={bottomLineY + 10}
        stroke={colors.accent}
        strokeWidth={1.5}
        opacity={0.75}
      />
    </>
  );
}
