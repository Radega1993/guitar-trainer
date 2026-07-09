import * as SQLite from 'expo-sqlite';
import { ANALYTICS_SCHEMA_SQL } from './schema';

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

async function createDatabase(): Promise<SQLite.SQLiteDatabase> {
  const db = await SQLite.openDatabaseAsync('guitar_trainer.db');
  await db.execAsync(ANALYTICS_SCHEMA_SQL);
  return db;
}

export function getAnalyticsDb(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = createDatabase();
  }
  return dbPromise;
}
