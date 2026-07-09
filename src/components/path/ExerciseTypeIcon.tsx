import React from 'react';
import Svg, { Circle, Line, Path, Polyline, Rect } from 'react-native-svg';
import { StageExerciseType } from '../../data/curriculum/types';

export type ExerciseIconVariant = StageExerciseType | 'fretboard' | 'locked' | 'completed' | 'check';

interface ExerciseTypeIconProps {
  type?: StageExerciseType;
  variant?: ExerciseIconVariant;
  size?: number;
  color?: string;
}

function BookIcon({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M5 4h7a2 2 0 0 1 2 2v14H7a2 2 0 0 0-2 2V6a2 2 0 0 1 2-2Z"
        stroke={color}
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
      <Path
        d="M12 4h7a2 2 0 0 1 2 2v14a2 2 0 0 0-2-2h-7V4Z"
        stroke={color}
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
      <Line x1="8" y1="8" x2="10" y2="8" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Line x1="8" y1="11" x2="10" y2="11" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  );
}

function QuizIcon({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="8.5" stroke={color} strokeWidth={1.8} />
      <Path
        d="M9.5 9.2a2.6 2.6 0 0 1 4.5 1.4c0 1.6-2.2 1.8-2.2 3.1"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
      <Circle cx="12" cy="16.8" r="1" fill={color} />
    </Svg>
  );
}

function RecognitionIcon({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Line x1="4" y1="14" x2="20" y2="14" stroke={color} strokeWidth={1.5} />
      <Line x1="4" y1="17" x2="20" y2="17" stroke={color} strokeWidth={1.5} />
      <Line x1="4" y1="11" x2="20" y2="11" stroke={color} strokeWidth={1.5} />
      <Circle cx="15" cy="11" r="3.2" fill={color} />
      <Line x1="17.8" y1="11" x2="17.8" y2="6.5" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

function FretboardIcon({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="4" y="7" width="16" height="10" rx="2" stroke={color} strokeWidth={1.8} />
      <Line x1="8" y1="7" x2="8" y2="17" stroke={color} strokeWidth={1.5} />
      <Line x1="12" y1="7" x2="12" y2="17" stroke={color} strokeWidth={1.5} />
      <Line x1="16" y1="7" x2="16" y2="17" stroke={color} strokeWidth={1.5} />
      <Line x1="4" y1="10" x2="20" y2="10" stroke={color} strokeWidth={1.2} />
      <Line x1="4" y1="13" x2="20" y2="13" stroke={color} strokeWidth={1.2} />
      <Circle cx="12" cy="13" r="2" fill={color} />
    </Svg>
  );
}

function ScrollingIcon({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Line x1="3" y1="9" x2="21" y2="9" stroke={color} strokeWidth={1.5} />
      <Line x1="3" y1="12" x2="21" y2="12" stroke={color} strokeWidth={1.5} />
      <Line x1="3" y1="15" x2="21" y2="15" stroke={color} strokeWidth={1.5} />
      <Circle cx="16" cy="12" r="2.5" fill={color} />
      <Path d="M6 6l2 2-2 2" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M18 18l-2-2 2-2" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function SpeedIcon({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M13 3L5 14h6l-1 7 9-12h-6l1-6Z"
        stroke={color}
        strokeWidth={1.8}
        strokeLinejoin="round"
        fill={color}
        fillOpacity={0.15}
      />
    </Svg>
  );
}

function MiniStudyIcon({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="5" y="5" width="14" height="14" rx="2" stroke={color} strokeWidth={1.8} />
      <Line x1="8" y1="9" x2="16" y2="9" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Line x1="8" y1="12" x2="14" y2="12" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Line x1="8" y1="15" x2="12" y2="15" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  );
}

function ExamIcon({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M6 18l3-6 3 3 4-8 2 11H6Z"
        stroke={color}
        strokeWidth={1.8}
        strokeLinejoin="round"
        fill={color}
        fillOpacity={0.12}
      />
      <Circle cx="18" cy="6" r="3" stroke={color} strokeWidth={1.6} />
      <Path d="M17 6h2M18 5v2" stroke={color} strokeWidth={1.2} strokeLinecap="round" />
    </Svg>
  );
}

function LockIcon({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="6" y="10" width="12" height="9" rx="2" stroke={color} strokeWidth={1.8} />
      <Path
        d="M8.5 10V8a3.5 3.5 0 0 1 7 0v2"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
      <Circle cx="12" cy="14.5" r="1.2" fill={color} />
    </Svg>
  );
}

function CheckIcon({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Polyline
        points="6,12 10,16 18,8"
        stroke={color}
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function resolveExerciseIconType(
  type?: StageExerciseType,
  state?: 'locked' | 'available' | 'current' | 'completed' | 'perfect',
  isBoss?: boolean
): ExerciseIconVariant {
  if (state === 'locked') return 'locked';
  if (isBoss || type === 'exam') return 'exam';
  if (type === 'fretboard') return 'fretboard';
  return type ?? 'fretboard';
}

export default function ExerciseTypeIcon({
  type,
  variant,
  size = 24,
  color = '#f5f0e9',
}: ExerciseTypeIconProps) {
  const resolved = variant ?? resolveExerciseIconType(type);

  switch (resolved) {
    case 'theory':
      return <BookIcon size={size} color={color} />;
    case 'quiz':
      return <QuizIcon size={size} color={color} />;
    case 'recognition':
      return <RecognitionIcon size={size} color={color} />;
    case 'fretboard':
      return <FretboardIcon size={size} color={color} />;
    case 'scrolling_reading':
      return <ScrollingIcon size={size} color={color} />;
    case 'speed':
      return <SpeedIcon size={size} color={color} />;
    case 'mini_study':
      return <MiniStudyIcon size={size} color={color} />;
    case 'exam':
      return <ExamIcon size={size} color={color} />;
    case 'locked':
      return <LockIcon size={size} color={color} />;
    case 'check':
    case 'completed':
      return <CheckIcon size={size} color={color} />;
    default:
      return <FretboardIcon size={size} color={color} />;
  }
}

export const EXERCISE_TYPE_LABELS: Record<StageExerciseType, string> = {
  theory: 'Teoría',
  quiz: 'Quiz',
  recognition: 'Reconocimiento',
  fretboard: 'Mástil',
  scrolling_reading: 'Lectura',
  speed: 'Velocidad',
  mini_study: 'Mini estudio',
  exam: 'Examen',
};
