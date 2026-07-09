export type StatsTimeFilter = 7 | 14 | 0;

export interface StatsKpis {
  levelsCompleted: number;
  totalStars: number;
  accuracyPct: number;
  avgResponseSeconds: number;
  totalAttempts: number;
}

export interface NoteHotspot {
  note: string;
  wrongCount: number;
  attempts: number;
  errorRatePct: number;
}

export interface StringHotspot {
  string: number;
  wrongCount: number;
  attempts: number;
  errorRatePct: number;
}

export interface TrendPoint {
  day: string;
  accuracyPct: number;
  attempts: number;
}

export interface StatsTip {
  id: string;
  severity: 'high' | 'medium' | 'low';
  text: string;
}

export interface UserStatsViewModel {
  kpis: StatsKpis;
  hotspots: {
    worstNotes: NoteHotspot[];
    worstStrings: StringHotspot[];
  };
  trend: TrendPoint[];
  trendDelta7d: number;
  tips: StatsTip[];
}
