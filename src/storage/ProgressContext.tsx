import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { RoundResult } from '../engine/scoring';
import { getLevelByOrder, getLevel } from '../data/levels';
import { getStudyBlockById, getStudyLevelById } from '../data/curriculum';
import { loadProgress, saveProgress, clearProgress } from './progressStore';
import { emptyProgress, LevelProgress, ProgressState } from './types';
import {
  clearAnalyticsData,
  makeEventId,
  saveExamAttemptEvent,
  upsertBlockProgressSnapshot,
  upsertLevelProgressSnapshot,
} from './sqlite/eventsRepository';

interface ProgressContextValue {
  state: ProgressState;
  loading: boolean;
  recordRound: (levelId: string, result: RoundResult) => void;
  recordStudyLevelResult: (studyLevelId: string, result: RoundResult) => void;
  recordBlockExamResult: (blockId: string, score: number, passed: boolean) => void;
  getLevelProgress: (levelId: string) => LevelProgress | undefined;
  isLevelUnlocked: (levelId: string) => boolean;
  isStudyLevelUnlocked: (studyLevelId: string) => boolean;
  isStudyBlockUnlocked: (blockId: string) => boolean;
  resetProgress: () => void;
}

const ProgressContext = createContext<ProgressContextValue | undefined>(undefined);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ProgressState>(emptyProgress);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    loadProgress().then((loaded) => {
      if (mounted) {
        setState(loaded);
        setLoading(false);
      }
      Object.entries(loaded.levels).forEach(([levelId, snapshot]) => {
        void upsertLevelProgressSnapshot({
          levelId,
          bestStars: snapshot.bestStars,
          bestAccuracy: snapshot.bestAccuracy,
          roundsPlayed: snapshot.rounds,
          completed: snapshot.completed,
        });
      });
      Object.entries(loaded.blocks).forEach(([blockId, snapshot]) => {
        void upsertBlockProgressSnapshot({
          blockId,
          bestStars: snapshot.bestStars,
          attempts: snapshot.attempts,
          completed: snapshot.completed,
          examPassed: snapshot.examPassed,
        });
      });
    });
    return () => {
      mounted = false;
    };
  }, []);

  const persist = useCallback((next: ProgressState) => {
    setState(next);
    void saveProgress(next);
  }, []);

  const recordRound = useCallback(
    (levelId: string, result: RoundResult) => {
      setState((prev) => {
        const existing = prev.levels[levelId];
        const nextLevel: LevelProgress = {
          bestStars: Math.max(existing?.bestStars ?? 0, result.stars),
          bestAccuracy: Math.max(existing?.bestAccuracy ?? 0, result.accuracy),
          rounds: (existing?.rounds ?? 0) + 1,
          completed: (existing?.completed ?? false) || result.stars >= 1,
        };
        const next: ProgressState = {
          levels: { ...prev.levels, [levelId]: nextLevel },
          studyLevels: prev.studyLevels,
          blocks: prev.blocks,
          exams: prev.exams,
          stats: {
            totalQuestions: prev.stats.totalQuestions + result.total,
            totalCorrect: prev.stats.totalCorrect + result.correct,
            totalTimeMs: prev.stats.totalTimeMs + result.timeMs,
            roundsPlayed: prev.stats.roundsPlayed + 1,
          },
        };
        void saveProgress(next);
        void upsertLevelProgressSnapshot({
          levelId,
          bestStars: nextLevel.bestStars,
          bestAccuracy: nextLevel.bestAccuracy,
          roundsPlayed: nextLevel.rounds,
          completed: nextLevel.completed,
        });
        return next;
      });
    },
    []
  );

  const getLevelProgress = useCallback(
    (levelId: string) => state.levels[levelId],
    [state.levels]
  );

  const getStudyLevelProgress = useCallback(
    (studyLevelId: string) => state.studyLevels[studyLevelId],
    [state.studyLevels]
  );

  const isLevelUnlocked = useCallback(
    (levelId: string) => {
      const level = getLevel(levelId);
      if (!level) return false;
      if (level.order === 1) return true;
      const previous = getLevelByOrder(level.order - 1);
      if (!previous) return true;
      return (state.levels[previous.id]?.bestStars ?? 0) >= 1;
    },
    [state.levels]
  );

  const isStudyBlockUnlocked = useCallback(
    (blockId: string) => {
      const block = getStudyBlockById(blockId);
      if (!block) return false;
      if (block.prerequisiteBlockIds.length === 0) return true;
      return block.prerequisiteBlockIds.every((reqId) => state.blocks[reqId]?.completed === true);
    },
    [state.blocks]
  );

  const isStudyLevelUnlocked = useCallback(
    (studyLevelId: string) => {
      const level = getStudyLevelById(studyLevelId);
      if (!level) return false;
      if (!isStudyBlockUnlocked(level.blockId)) return false;
      const prev = level.unlockRequirements.previousLevelId;
      if (!prev) return true;
      return (getStudyLevelProgress(prev)?.bestStars ?? 0) >= 1;
    },
    [getStudyLevelProgress, isStudyBlockUnlocked]
  );

  const recordStudyLevelResult = useCallback((studyLevelId: string, result: RoundResult) => {
    setState((prev) => {
      const existing = prev.studyLevels[studyLevelId];
      const nextLevel: LevelProgress = {
        bestStars: Math.max(existing?.bestStars ?? 0, result.stars),
        bestAccuracy: Math.max(existing?.bestAccuracy ?? 0, result.accuracy),
        rounds: (existing?.rounds ?? 0) + 1,
        completed: (existing?.completed ?? false) || result.stars >= 1,
      };
      const next = {
        ...prev,
        studyLevels: {
          ...prev.studyLevels,
          [studyLevelId]: nextLevel,
        },
      };
      void saveProgress(next);
      return next;
    });
  }, []);

  const recordBlockExamResult = useCallback((blockId: string, score: number, passed: boolean) => {
    setState((prev) => {
      const existingBlock = prev.blocks[blockId];
      const existingExam = prev.exams[blockId];
      const next = {
        ...prev,
        blocks: {
          ...prev.blocks,
          [blockId]: {
            bestStars: Math.max(existingBlock?.bestStars ?? 0, passed ? 3 : 0),
            attempts: (existingBlock?.attempts ?? 0) + 1,
            completed: passed || (existingBlock?.completed ?? false),
            examPassed: passed || (existingBlock?.examPassed ?? false),
          },
        },
        exams: {
          ...prev.exams,
          [blockId]: {
            attempts: (existingExam?.attempts ?? 0) + 1,
            bestScore: Math.max(existingExam?.bestScore ?? 0, score),
            passedAt: passed ? new Date().toISOString() : existingExam?.passedAt,
          },
        },
      };
      void saveProgress(next);
      void upsertBlockProgressSnapshot({
        blockId,
        bestStars: next.blocks[blockId].bestStars,
        attempts: next.blocks[blockId].attempts,
        completed: next.blocks[blockId].completed,
        examPassed: next.blocks[blockId].examPassed,
      });
      void saveExamAttemptEvent({
        id: makeEventId('exam'),
        blockId,
        score,
        passed,
        createdAt: new Date().toISOString(),
      });
      return next;
    });
  }, []);

  const resetProgress = useCallback(() => {
    persist(emptyProgress);
    void clearProgress();
    void clearAnalyticsData();
  }, [persist]);

  const value = useMemo(
    () => ({
      state,
      loading,
      recordRound,
      recordStudyLevelResult,
      recordBlockExamResult,
      getLevelProgress,
      isLevelUnlocked,
      isStudyLevelUnlocked,
      isStudyBlockUnlocked,
      resetProgress,
    }),
    [
      state,
      loading,
      recordRound,
      recordStudyLevelResult,
      recordBlockExamResult,
      getLevelProgress,
      isLevelUnlocked,
      isStudyLevelUnlocked,
      isStudyBlockUnlocked,
      resetProgress,
    ]
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return ctx;
}
