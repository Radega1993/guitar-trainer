import { getAnalyticsDb } from './db';

export interface LevelProgressSnapshot {
  levelId: string;
  bestStars: number;
  bestAccuracy: number;
  roundsPlayed: number;
  completed: boolean;
}

export interface RoundEvent {
  id: string;
  levelId: string;
  startedAt: string;
  endedAt: string;
  totalQuestions: number;
  correctCount: number;
  stars: number;
  durationMs: number;
}

export interface ResponseEvent {
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

function nowIso(): string {
  return new Date().toISOString();
}

export function makeEventId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export async function upsertLevelProgressSnapshot(snapshot: LevelProgressSnapshot): Promise<void> {
  const db = await getAnalyticsDb();
  await db.runAsync(
    `
    INSERT INTO level_progress (
      level_id, best_stars, best_accuracy, rounds_played, completed, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(level_id) DO UPDATE SET
      best_stars = excluded.best_stars,
      best_accuracy = excluded.best_accuracy,
      rounds_played = excluded.rounds_played,
      completed = excluded.completed,
      updated_at = excluded.updated_at
    `,
    snapshot.levelId,
    snapshot.bestStars,
    snapshot.bestAccuracy,
    snapshot.roundsPlayed,
    snapshot.completed ? 1 : 0,
    nowIso()
  );
}

export async function saveRoundEvent(round: RoundEvent): Promise<void> {
  const db = await getAnalyticsDb();
  await db.runAsync(
    `
    INSERT INTO rounds (
      id, level_id, started_at, ended_at, total_questions, correct_count, stars, duration_ms
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
    round.id,
    round.levelId,
    round.startedAt,
    round.endedAt,
    round.totalQuestions,
    round.correctCount,
    round.stars,
    round.durationMs
  );
}

export async function saveResponseEvent(response: ResponseEvent): Promise<void> {
  const db = await getAnalyticsDb();
  await db.runAsync(
    `
    INSERT INTO responses (
      id, round_id, question_index, level_id,
      target_note, target_string, target_fret,
      selected_string, selected_fret, is_correct,
      response_time_ms, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    response.id,
    response.roundId,
    response.questionIndex,
    response.levelId,
    response.targetNote,
    response.targetString,
    response.targetFret,
    response.selectedString,
    response.selectedFret,
    response.isCorrect ? 1 : 0,
    response.responseTimeMs,
    response.createdAt
  );
}

export async function clearAnalyticsData(): Promise<void> {
  const db = await getAnalyticsDb();
  await db.execAsync(`
    DELETE FROM responses;
    DELETE FROM rounds;
    DELETE FROM level_progress;
  `);
}
