import { getAnalyticsDb } from './db';

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

function responsesRangeClause(days: number | null): { sql: string; args: string[] } {
  if (!days) return { sql: '', args: [] };
  return { sql: `WHERE datetime(created_at) >= datetime('now', ?)`, args: [`-${days} days`] };
}

export async function queryKpis(days: number | null): Promise<KpiRow> {
  const db = await getAnalyticsDb();
  const range = responsesRangeClause(days);

  const levelRow = await db.getFirstAsync<{ levels_completed: number; total_stars: number }>(
    `
    SELECT
      COALESCE(SUM(CASE WHEN best_stars >= 1 THEN 1 ELSE 0 END), 0) AS levels_completed,
      COALESCE(SUM(best_stars), 0) AS total_stars
    FROM level_progress
    `
  );

  const responseRow = await db.getFirstAsync<{
    total_correct: number;
    total_attempts: number;
    accuracy: number;
    avg_response_ms: number;
  }>(
    `
    SELECT
      COALESCE(SUM(is_correct), 0) AS total_correct,
      COUNT(*) AS total_attempts,
      CASE WHEN COUNT(*) = 0 THEN 0.0 ELSE 1.0 * SUM(is_correct) / COUNT(*) END AS accuracy,
      COALESCE(AVG(response_time_ms), 0) AS avg_response_ms
    FROM responses
    ${range.sql}
    `,
    ...range.args
  );

  return {
    levelsCompleted: Number(levelRow?.levels_completed ?? 0),
    totalStars: Number(levelRow?.total_stars ?? 0),
    totalCorrect: Number(responseRow?.total_correct ?? 0),
    totalAttempts: Number(responseRow?.total_attempts ?? 0),
    accuracy: Number(responseRow?.accuracy ?? 0),
    avgResponseMs: Number(responseRow?.avg_response_ms ?? 0),
  };
}

export async function queryWorstNotes(
  days: number | null,
  minAttempts = 3,
  limit = 3
): Promise<NoteHotspotRow[]> {
  const db = await getAnalyticsDb();
  const range = responsesRangeClause(days);
  const whereSql = range.sql.length > 0 ? `${range.sql}` : '';
  const rows = await db.getAllAsync<{
    target_note: string;
    wrong_count: number;
    attempts: number;
    error_rate: number;
  }>(
    `
    SELECT
      target_note,
      SUM(CASE WHEN is_correct = 0 THEN 1 ELSE 0 END) AS wrong_count,
      COUNT(*) AS attempts,
      CASE WHEN COUNT(*) = 0 THEN 0.0
           ELSE 1.0 * SUM(CASE WHEN is_correct = 0 THEN 1 ELSE 0 END) / COUNT(*) END AS error_rate
    FROM responses
    ${whereSql}
    GROUP BY target_note
    HAVING COUNT(*) >= ?
    ORDER BY wrong_count DESC, error_rate DESC
    LIMIT ?
    `,
    ...range.args,
    minAttempts,
    limit
  );

  return rows.map((r) => ({
    targetNote: r.target_note,
    wrongCount: Number(r.wrong_count),
    attempts: Number(r.attempts),
    errorRate: Number(r.error_rate),
  }));
}

export async function queryWorstStrings(
  days: number | null,
  minAttempts = 3,
  limit = 3
): Promise<StringHotspotRow[]> {
  const db = await getAnalyticsDb();
  const range = responsesRangeClause(days);
  const whereSql = range.sql.length > 0 ? `${range.sql}` : '';
  const rows = await db.getAllAsync<{
    target_string: number;
    wrong_count: number;
    attempts: number;
    error_rate: number;
  }>(
    `
    SELECT
      target_string,
      SUM(CASE WHEN is_correct = 0 THEN 1 ELSE 0 END) AS wrong_count,
      COUNT(*) AS attempts,
      CASE WHEN COUNT(*) = 0 THEN 0.0
           ELSE 1.0 * SUM(CASE WHEN is_correct = 0 THEN 1 ELSE 0 END) / COUNT(*) END AS error_rate
    FROM responses
    ${whereSql}
    GROUP BY target_string
    HAVING COUNT(*) >= ?
    ORDER BY wrong_count DESC, error_rate DESC
    LIMIT ?
    `,
    ...range.args,
    minAttempts,
    limit
  );

  return rows.map((r) => ({
    targetString: Number(r.target_string),
    wrongCount: Number(r.wrong_count),
    attempts: Number(r.attempts),
    errorRate: Number(r.error_rate),
  }));
}

export async function queryDailyAccuracy(days = 14): Promise<DailyAccuracyRow[]> {
  const db = await getAnalyticsDb();
  const rows = await db.getAllAsync<{
    day: string;
    correct: number;
    attempts: number;
    accuracy: number;
  }>(
    `
    SELECT
      date(created_at) AS day,
      SUM(is_correct) AS correct,
      COUNT(*) AS attempts,
      CASE WHEN COUNT(*) = 0 THEN 0.0 ELSE 1.0 * SUM(is_correct) / COUNT(*) END AS accuracy
    FROM responses
    WHERE datetime(created_at) >= datetime('now', ?)
    GROUP BY date(created_at)
    ORDER BY day ASC
    `,
    `-${days} days`
  );

  return rows.map((r) => ({
    day: r.day,
    correct: Number(r.correct),
    attempts: Number(r.attempts),
    accuracy: Number(r.accuracy),
  }));
}
