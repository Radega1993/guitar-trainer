import React from 'react';
import Svg, { G, Line, Path } from 'react-native-svg';
import { colors } from '../theme';
import { G_CLEF_PATH } from './gClefPath';

interface StaffLinesProps {
  width: number;
  height: number;
  topLineY: number;
  lineGap: number;
  children?: React.ReactNode;
}

export default function StaffLines({ width, height, topLineY, lineGap, children }: StaffLinesProps) {
  const clefHeight = height * 0.86;
  const clefScale = clefHeight / 512;
  const clefX = 16;
  const clefY = height / 2 - clefHeight / 2;

  return (
    <Svg width={width} height={height}>
      {[0, 1, 2, 3, 4].map((i) => (
        <Line
          key={`staff-line-${i}`}
          x1={12}
          y1={topLineY + i * lineGap}
          x2={width - 12}
          y2={topLineY + i * lineGap}
          stroke={colors.textMuted}
          strokeWidth={1.2}
        />
      ))}
      <G transform={`translate(${clefX}, ${clefY}) scale(${clefScale})`}>
        <Path d={G_CLEF_PATH} fill={colors.text} />
      </G>
      {children}
    </Svg>
  );
}
