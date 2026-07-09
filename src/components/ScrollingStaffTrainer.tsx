import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';
import { Easing, runOnJS, useSharedValue, withTiming } from 'react-native-reanimated';
import { Question } from '../engine/exercise';
import { noteNameEn } from '../domain/notes';
import { staffStep } from '../domain/staff';
import Fretboard, { MarkerStatus } from './fretboard/Fretboard';
import StaffLines from './staff/StaffLines';
import ScrollingNote from './staff/ScrollingNote';
import ReadingTargetZone from './staff/ReadingTargetZone';
import ExerciseFeedback from './common/ExerciseFeedback';
import {
  StaffNoteStatus,
  TrainerSpeed,
  canAnswer,
  computeTargetOffset,
  nextActiveIndex,
  shouldLockFretboard,
  speedToDurationMs,
} from '../engine/scrollingTimeline';
import { colors, radius, spacing } from '../theme';
import { useSettingsStore } from '../settings/store';
import { formatAmericanRawName } from '../settings/noteFormat';

export interface ScrollingTrainerNote {
  id: string;
  noteName: string;
  octave: number;
  displayName: string;
  validPositions: { string: number; fret: number }[];
  initialX: number;
  staffYPosition: number;
  status: StaffNoteStatus;
  questionIndex: number;
  question: Question;
}

export interface ScrollingStaffTrainerProps {
  questions: Question[];
  speed?: TrainerSpeed;
  previewNotes?: number;
  spacingBetweenNotes?: number;
  autoStart?: boolean;
  pauseOnWrongAnswer?: boolean;
  showTargetZone?: boolean;
  lockFretboardWhileMoving?: boolean;
  onResponse?: (payload: {
    questionIndex: number;
    question: Question;
    selected: { string: number; fret: number };
    isCorrect: boolean;
    responseTimeMs: number;
  }) => void;
  onComplete: (payload: {
    correctCount: number;
    total: number;
    totalTimeMs: number;
    avgResponseMs: number;
  }) => void;
  onActiveIndexChange?: (index: number) => void;
}

const LINE_GAP = 15;
const STAFF_HEIGHT = 190;
const FEEDBACK_DELAY_MS = 900;

export default function ScrollingStaffTrainer({
  questions,
  speed = 'normal',
  previewNotes = 4,
  spacingBetweenNotes = 56,
  autoStart = true,
  pauseOnWrongAnswer = false,
  showTargetZone = true,
  lockFretboardWhileMoving = true,
  onResponse,
  onComplete,
  onActiveIndexChange,
}: ScrollingStaffTrainerProps) {
  const [width, setWidth] = useState(0);
  const [notesQueue, setNotesQueue] = useState<ScrollingTrainerNote[]>([]);
  const [activeNoteIndex, setActiveNoteIndex] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  const [canAnswerState, setCanAnswerState] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<{ string: number; fret: number } | null>(null);
  const [feedback, setFeedback] = useState<{ ok: boolean; message: string } | null>(null);
  const [score, setScore] = useState(0);
  const [centerX, setCenterX] = useState(0);
  const [currentSpeed, setCurrentSpeed] = useState(speed);
  const [waitingContinue, setWaitingContinue] = useState(false);
  const noteNamingSystem = useSettingsStore((s) => s.noteNamingSystem);
  const hasAutoStartedRef = useRef(false);
  const startAtRef = useRef(Date.now());
  const readyAtRef = useRef(0);
  const totalResponseMsRef = useRef(0);
  const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const globalOffset = useSharedValue(0);
  const animationDuration = speedToDurationMs(currentSpeed);

  const topLineY = STAFF_HEIGHT / 2 - 2 * LINE_GAP;
  const bottomLineY = STAFF_HEIGHT / 2 + 2 * LINE_GAP;

  const initializeQueue = useCallback(
    (w: number) => {
      if (w <= 0 || questions.length === 0) return;
      const noteAreaStart = 16 + (STAFF_HEIGHT * 0.86) / 512 * 512 + 12;
      const areaWidth = Math.max(0, w - 16 - noteAreaStart);
      const computedCenterX = noteAreaStart + areaWidth * 0.42;
      const startX = w + spacingBetweenNotes;

      const created: ScrollingTrainerNote[] = questions.map((q, i) => {
        const name = noteNameEn(q.note, true);
        return {
          id: `note-${i}-${q.midi}-${q.position.string}-${q.position.fret}`,
          noteName: q.note.letter,
          octave: q.note.octave,
          displayName: formatAmericanRawName(name, noteNamingSystem),
          validPositions: [{ string: q.position.string, fret: q.position.fret }],
          initialX: startX + i * spacingBetweenNotes,
          staffYPosition: staffStep(q.note),
          status: i === 0 ? 'moving' : 'upcoming',
          questionIndex: i,
          question: q,
        };
      });

      setCenterX(computedCenterX);
      setNotesQueue(created);
      setActiveNoteIndex(0);
      setIsMoving(false);
      setCanAnswerState(false);
      setSelectedAnswer(null);
      setFeedback(null);
      setScore(0);
      setWaitingContinue(false);
      hasAutoStartedRef.current = false;
      totalResponseMsRef.current = 0;
      startAtRef.current = Date.now();
      globalOffset.value = 0;
    },
    [questions, spacingBetweenNotes, globalOffset, noteNamingSystem]
  );

  const onLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    if (w !== width) {
      setWidth(w);
      initializeQueue(w);
    }
  };

  const setStatusesForMoving = useCallback((activeIdx: number) => {
    setNotesQueue((prev) =>
      prev.map((n, i) => {
        if (i < activeIdx) return { ...n, status: 'answered' };
        if (i === activeIdx) return { ...n, status: 'moving' };
        return { ...n, status: 'upcoming' };
      })
    );
  }, []);

  const onReachedCenter = useCallback(
    (idx: number) => {
      setIsMoving(false);
      setCanAnswerState(true);
      readyAtRef.current = Date.now();
      setNotesQueue((prev) =>
        prev.map((n, i) => {
          if (i === idx) return { ...n, status: 'active' };
          return n;
        })
      );
    },
    []
  );

  const moveTimelineToActive = useCallback(
    (idx: number) => {
      if (!notesQueue[idx]) return;
      const targetOffset = computeTargetOffset(notesQueue[idx].initialX, centerX);
      setIsMoving(true);
      setCanAnswerState(false);
      setStatusesForMoving(idx);
      globalOffset.value = withTiming(
        targetOffset,
        {
          duration: animationDuration,
          easing: Easing.out(Easing.cubic),
        },
        (finished) => {
          if (finished) runOnJS(onReachedCenter)(idx);
        }
      );
    },
    [animationDuration, centerX, globalOffset, notesQueue, onReachedCenter, setStatusesForMoving]
  );

  useEffect(() => {
    if (autoStart && notesQueue.length > 0 && centerX > 0 && !hasAutoStartedRef.current) {
      hasAutoStartedRef.current = true;
      moveTimelineToActive(0);
    }
  }, [autoStart, notesQueue.length, centerX, moveTimelineToActive]);

  useEffect(() => {
    if (width > 0) {
      initializeQueue(width);
    }
  }, [noteNamingSystem, width, initializeQueue]);

  useEffect(() => {
    onActiveIndexChange?.(activeNoteIndex);
  }, [activeNoteIndex, onActiveIndexChange]);

  useEffect(() => {
    return () => {
      if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    };
  }, []);

  const finishIfNeeded = useCallback(
    (nextIdx: number | null) => {
      if (nextIdx != null) return false;
      const total = notesQueue.length;
      const totalTimeMs = Date.now() - startAtRef.current;
      const avgResponseMs = total > 0 ? totalResponseMsRef.current / total : 0;
      onComplete({ correctCount: score, total, totalTimeMs, avgResponseMs });
      return true;
    },
    [notesQueue.length, onComplete, score]
  );

  const continueToNext = useCallback(() => {
    setFeedback(null);
    setSelectedAnswer(null);
    setWaitingContinue(false);
    const nextIdx = nextActiveIndex(activeNoteIndex, notesQueue.length);
    if (finishIfNeeded(nextIdx)) return;
    setActiveNoteIndex(nextIdx!);
    moveTimelineToActive(nextIdx!);
  }, [activeNoteIndex, notesQueue.length, finishIfNeeded, moveTimelineToActive]);

  const handleSelect = (selection: { string: number; fret: number }) => {
    if (!canAnswer(canAnswerState, isMoving, lockFretboardWhileMoving)) return;
    const active = notesQueue[activeNoteIndex];
    if (!active) return;

    const responseTimeMs = Date.now() - readyAtRef.current;
    totalResponseMsRef.current += responseTimeMs;
    const ok = active.validPositions.some(
      (v) => v.string === selection.string && v.fret === selection.fret
    );

    setSelectedAnswer(selection);
    setCanAnswerState(false);
    setFeedback({
      ok,
      message: ok
        ? '¡Correcto!'
        : `Era ${active.displayName} en ${active.validPositions[0].string}.ª cuerda traste ${active.validPositions[0].fret}`,
    });
    setNotesQueue((prev) =>
      prev.map((n, i) => (i === activeNoteIndex ? { ...n, status: ok ? 'correct' : 'wrong' } : n))
    );
    if (ok) setScore((s) => s + 1);

    onResponse?.({
      questionIndex: active.questionIndex,
      question: active.question,
      selected: selection,
      isCorrect: ok,
      responseTimeMs,
    });

    if (!ok && pauseOnWrongAnswer) {
      setWaitingContinue(true);
      return;
    }

    if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    feedbackTimerRef.current = setTimeout(continueToNext, FEEDBACK_DELAY_MS);
  };

  const visibleRangeEnd = Math.min(notesQueue.length, activeNoteIndex + 1 + previewNotes);
  const visibleQueue = notesQueue.slice(Math.max(0, activeNoteIndex - 1), visibleRangeEnd);
  const displayFrets = Math.max(
    4,
    ...notesQueue.map((n) => n.validPositions[0]?.fret ?? 0)
  );
  const lockByMovement = shouldLockFretboard(isMoving, lockFretboardWhileMoving);
  const canTapFretboard = canAnswerState && !lockByMovement && !waitingContinue;

  const marker = useMemo(() => {
    if (!selectedAnswer || !feedback) return null;
    return {
      position: selectedAnswer,
      status: (feedback.ok ? 'correct' : 'wrong') as MarkerStatus,
    };
  }, [selectedAnswer, feedback]);

  const activeTargetString = notesQueue[activeNoteIndex]?.validPositions[0]?.string ?? null;
  const activeDisplayName = notesQueue[activeNoteIndex]?.displayName ?? '';

  return (
    <View>
      <View style={styles.staffWrap} onLayout={onLayout}>
        {width > 0 ? (
          <StaffLines width={width} height={STAFF_HEIGHT} topLineY={topLineY} lineGap={LINE_GAP}>
            <ReadingTargetZone
              centerX={centerX}
              topLineY={topLineY}
              bottomLineY={bottomLineY}
              visible={showTargetZone}
            />
            {visibleQueue.map((note) => (
              <ScrollingNote
                key={note.id}
                note={note.question.note}
                displayName={note.displayName}
                initialX={note.initialX}
                staffStepValue={note.staffYPosition}
                globalOffset={globalOffset}
                lineGap={LINE_GAP}
                bottomLineY={bottomLineY}
                status={note.status}
                showLabel={note.questionIndex === activeNoteIndex && !!feedback}
                labelY={STAFF_HEIGHT - 8}
              />
            ))}
          </StaffLines>
        ) : null}
      </View>

      <Text style={styles.prompt}>
        {isMoving ? (
          <Text style={styles.promptStrong}>Lee la siguiente nota...</Text>
        ) : (
          <>
            Toca esta nota en la <Text style={styles.promptStrong}>{activeTargetString}.ª cuerda</Text>
          </>
        )}
      </Text>

      <View style={styles.fretWrap}>
        <Fretboard
          displayFrets={displayFrets}
          onSelect={handleSelect}
          marker={marker}
          highlightString={activeTargetString}
          disabled={!canTapFretboard}
        />
      </View>

      <ExerciseFeedback
        visible={!!feedback}
        ok={feedback?.ok ?? false}
        message={feedback?.message ?? ''}
        pauseOnWrongAnswer={pauseOnWrongAnswer}
        onContinue={waitingContinue ? continueToNext : undefined}
      />

      <Text style={styles.metaText}>
        Nota activa: {activeDisplayName} · Estado: {isMoving ? 'moviendo' : canTapFretboard ? 'responde' : 'feedback'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  staffWrap: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    marginTop: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  prompt: {
    color: colors.textMuted,
    fontSize: 16,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
  promptStrong: {
    color: colors.accent,
    fontWeight: '800',
  },
  fretWrap: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: spacing.lg,
  },
  metaText: {
    color: colors.textMuted,
    fontSize: 12,
    textAlign: 'center',
  },
});
