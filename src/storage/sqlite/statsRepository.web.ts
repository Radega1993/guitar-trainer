interface LevelProgressSnapshot {
  levelId: string;
  bestStars: number;
  bestAccuracy: number;
  roundsPlayed: number;
  completed: boolean;
}

interface ResponseEvent {
  id: string;
  roundId: string;
  questionIndex: number;
  levelId: string;
  targetNote: string;
  targetString: number;
  targetFret: number;
  selectedString: number | null;
  selectedFret: number | null;
  isCorrect: boolean;
  responseTimeMs: number;
  createdAt: string;
}

interface WebAnalyticsStore {
  levelProgress: Record<string, LevelProgressSnapshot>;
  responses: ResponseEvent[];
}

const globalStore = globalThis as unknown as {
  __guitarTrainerWebAnalyticsStore?: WebAnalyticsStore;
};

function getWebAnalyticsStore(): WebAnalyticsStore {
  if (!globalStore.__guitarTrainerWebAnalyticsStore) {
    globalStore.__guitarTrainerWebAnalyticsStore = {
      levelProgress: {},
      responses: [],
    };
  }
  return globalStore.__guitarTrainerWebAnalyticsStore;
}

export interface KpiRow {
  levelsCompleted: number;
  totalStars: number;
  totalCorrect: number;
  totalAttempts: number;
  accuracy: number;
  avgResponseMs: number;
}

export interface NoteHotspotRow {
  targetNote: string;
  wrongCount: number;
  attempts: number;
  errorRate: number;
}

export interface StringHotspotRow {
  targetString: number;
  wrongCount: number;
  attempts: number;
  errorRate: number;
}

export interface DailyAccuracyRow {
  day: string;
  correct: number;
  attempts: number;
  accuracy: number;
}

function inRange(createdAt: string, days: number | null): boolean {
  if (!days) return true;
  const now = Date.now();
  const ts = new Date(createdAt).getTime();
  const diffMs = now - ts;
  return diffMs <= days * 24 * 60 * 60 * 1000;
}

function filteredResponses(days: number | null) {
  const { responses } = getWebAnalyticsStore();
  return responses.filter((r: ResponseEvent) => inRange(r.createdAt, days));
}

export async function queryKpis(days: number | null): Promise<KpiRow> {
  const { levelProgress } = getWebAnalyticsStore();
  const responses = filteredResponses(days);
  const totalAttempts = responses.length;
  const totalCorrect = responses.reduce((sum: number, r: ResponseEvent) => sum + (r.isCorrect ? 1 : 0), 0);
  const avgResponseMs =
    totalAttempts > 0
      ? responses.reduce((sum: number, r: ResponseEvent) => sum + r.responseTimeMs, 0) / totalAttempts
      : 0;

  const progressRows = Object.values(levelProgress) as LevelProgressSnapshot[];
  return {
    levelsCompleted: progressRows.filter((p) => p.bestStars >= 1).length,
    totalStars: progressRows.reduce((sum, p) => sum + p.bestStars, 0),
    totalCorrect,
    totalAttempts,
    accuracy: totalAttempts > 0 ? totalCorrect / totalAttempts : 0,
    avgResponseMs,
  };
}

export async function queryWorstNotes(
  days: number | null,
  minAttempts = 3,
  limit = 3
): Promise<NoteHotspotRow[]> {
  const rows = filteredResponses(days);
  const byNote = new Map<string, { attempts: number; wrong: number }>();

  rows.forEach((r: ResponseEvent) => {
    const current = byNote.get(r.targetNote) ?? { attempts: 0, wrong: 0 };
    current.attempts += 1;
    current.wrong += r.isCorrect ? 0 : 1;
    byNote.set(r.targetNote, current);
  });

  return Array.from(byNote.entries())
    .filter(([, value]) => value.attempts >= minAttempts)
    .map(([targetNote, value]) => ({
      targetNote,
      wrongCount: value.wrong,
      attempts: value.attempts,
      errorRate: value.attempts > 0 ? value.wrong / value.attempts : 0,
    }))
    .sort((a, b) => b.wrongCount - a.wrongCount || b.errorRate - a.errorRate)
    .slice(0, limit);
}

export async function queryWorstStrings(
  days: number | null,
  minAttempts = 3,
  limit = 3
): Promise<StringHotspotRow[]> {
  const rows = filteredResponses(days);
  const byString = new Map<number, { attempts: number; wrong: number }>();

  rows.forEach((r: ResponseEvent) => {
    const current = byString.get(r.targetString) ?? { attempts: 0, wrong: 0 };
    current.attempts += 1;
    current.wrong += r.isCorrect ? 0 : 1;
    byString.set(r.targetString, current);
  });

  return Array.from(byString.entries())
    .filter(([, value]) => value.attempts >= minAttempts)
    .map(([targetString, value]) => ({
      targetString,
      wrongCount: value.wrong,
      attempts: value.attempts,
      errorRate: value.attempts > 0 ? value.wrong / value.attempts : 0,
    }))
    .sort((a, b) => b.wrongCount - a.wrongCount || b.errorRate - a.errorRate)
    .slice(0, limit);
}

export async function queryDailyAccuracy(days = 14): Promise<DailyAccuracyRow[]> {
  const rows = filteredResponses(days);
  const byDay = new Map<string, { attempts: number; correct: number }>();

  rows.forEach((r: ResponseEvent) => {
    const day = r.createdAt.slice(0, 10);
    const current = byDay.get(day) ?? { attempts: 0, correct: 0 };
    current.attempts += 1;
    current.correct += r.isCorrect ? 1 : 0;
    byDay.set(day, current);
  });

  return Array.from(byDay.entries())
    .map(([day, value]) => ({
      day,
      correct: value.correct,
      attempts: value.attempts,
      accuracy: value.attempts > 0 ? value.correct / value.attempts : 0,
    }))
    .sort((a, b) => a.day.localeCompare(b.day));
}
