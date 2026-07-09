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
import { loadProgress, saveProgress, clearProgress } from './progressStore';
import { emptyProgress, LevelProgress, ProgressState } from './types';
import { clearAnalyticsData, upsertLevelProgressSnapshot } from './sqlite/eventsRepository';

interface ProgressContextValue {
  state: ProgressState;
  loading: boolean;
  recordRound: (levelId: string, result: RoundResult) => void;
  getLevelProgress: (levelId: string) => LevelProgress | undefined;
  isLevelUnlocked: (levelId: string) => boolean;
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
      getLevelProgress,
      isLevelUnlocked,
      resetProgress,
    }),
    [state, loading, recordRound, getLevelProgress, isLevelUnlocked, resetProgress]
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
