import { buildTips } from './tipsEngine';
import { NoteHotspot, StringHotspot, TrendPoint, UserStatsViewModel } from './types';

export interface StatsModelInput {
  kpis: {
    levelsCompleted: number;
    totalStars: number;
    totalCorrect: number;
    totalAttempts: number;
    accuracy: number;
    avgResponseMs: number;
  };
  worstNotesRaw: {
    targetNote: string;
    wrongCount: number;
    attempts: number;
    errorRate: number;
  }[];
  worstStringsRaw: {
    targetString: number;
    wrongCount: number;
    attempts: number;
    errorRate: number;
  }[];
  dailyRaw: {
    day: string;
    correct: number;
    attempts: number;
    accuracy: number;
  }[];
  trendDays: number;
}

function toPct(value: number): number {
  return Math.round(value * 100);
}

function formatDay(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function fillTrendDays(days: number, points: TrendPoint[]): TrendPoint[] {
  const byDay = new Map(points.map((p) => [p.day, p]));
  const out: TrendPoint[] = [];
  const base = new Date();
  base.setHours(0, 0, 0, 0);

  for (let i = days - 1; i >= 0; i--) {
    const day = new Date(base);
    day.setDate(base.getDate() - i);
    const key = formatDay(day);
    out.push(byDay.get(key) ?? { day: key, accuracyPct: 0, attempts: 0 });
  }

  return out;
}

function computeTrendDelta7d(points: TrendPoint[]): number {
  if (points.length < 6) return 0;
  const latest3 = points.slice(-3);
  const previous3 = points.slice(-6, -3);
  const avg = (rows: TrendPoint[]) =>
    rows.reduce((sum, row) => sum + row.accuracyPct, 0) / Math.max(rows.length, 1);
  return Math.round((avg(latest3) - avg(previous3)) * 10) / 10;
}

export function buildUserStatsViewModel(params: StatsModelInput): UserStatsViewModel {
  const worstNotes: NoteHotspot[] = params.worstNotesRaw.map((row) => ({
    note: row.targetNote,
    wrongCount: row.wrongCount,
    attempts: row.attempts,
    errorRatePct: toPct(row.errorRate),
  }));

  const worstStrings: StringHotspot[] = params.worstStringsRaw.map((row) => ({
    string: row.targetString,
    wrongCount: row.wrongCount,
    attempts: row.attempts,
    errorRatePct: toPct(row.errorRate),
  }));

  const trend = fillTrendDays(
    params.trendDays,
    params.dailyRaw.map((row) => ({
      day: row.day,
      accuracyPct: toPct(row.accuracy),
      attempts: row.attempts,
    }))
  );

  const vm: UserStatsViewModel = {
    kpis: {
      levelsCompleted: params.kpis.levelsCompleted,
      totalStars: params.kpis.totalStars,
      accuracyPct: toPct(params.kpis.accuracy),
      avgResponseSeconds: Math.round((params.kpis.avgResponseMs / 1000) * 10) / 10,
      totalAttempts: params.kpis.totalAttempts,
    },
    hotspots: {
      worstNotes,
      worstStrings,
    },
    trend,
    trendDelta7d: computeTrendDelta7d(trend),
    tips: [],
  };

  vm.tips = buildTips({
    kpis: vm.kpis,
    worstNotes: vm.hotspots.worstNotes,
    worstStrings: vm.hotspots.worstStrings,
    trend: vm.trend,
  });

  return vm;
}
