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
  sessionMode?: string;
  sessionSource?: string;
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
  sessionMode?: string;
  sessionSource?: string;
  targetNote: string;
  targetString: number;
  targetFret: number;
  selectedString: number | null;
  selectedFret: number | null;
  isCorrect: boolean;
  responseTimeMs: number;
  createdAt: string;
}

export interface BlockProgressSnapshot {
  blockId: string;
  bestStars: number;
  attempts: number;
  completed: boolean;
  examPassed: boolean;
}

export interface ExamAttemptEvent {
  id: string;
  blockId: string;
  score: number;
  passed: boolean;
  createdAt: string;
}

interface WebAnalyticsStore {
  levelProgress: Record<string, LevelProgressSnapshot>;
  blockProgress: Record<string, BlockProgressSnapshot>;
  examAttempts: ExamAttemptEvent[];
  rounds: RoundEvent[];
  responses: ResponseEvent[];
}

const globalStore = globalThis as unknown as {
  __guitarTrainerWebAnalyticsStore?: WebAnalyticsStore;
};

function getStore(): WebAnalyticsStore {
  if (!globalStore.__guitarTrainerWebAnalyticsStore) {
    globalStore.__guitarTrainerWebAnalyticsStore = {
      levelProgress: {},
      blockProgress: {},
      examAttempts: [],
      rounds: [],
      responses: [],
    };
  }
  return globalStore.__guitarTrainerWebAnalyticsStore;
}

export function makeEventId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export async function upsertLevelProgressSnapshot(snapshot: LevelProgressSnapshot): Promise<void> {
  const store = getStore();
  store.levelProgress[snapshot.levelId] = snapshot;
}

export async function saveRoundEvent(round: RoundEvent): Promise<void> {
  const store = getStore();
  store.rounds.push(round);
}

export async function saveResponseEvent(response: ResponseEvent): Promise<void> {
  const store = getStore();
  store.responses.push(response);
}

export async function upsertBlockProgressSnapshot(snapshot: BlockProgressSnapshot): Promise<void> {
  const store = getStore();
  store.blockProgress[snapshot.blockId] = snapshot;
}

export async function saveExamAttemptEvent(event: ExamAttemptEvent): Promise<void> {
  const store = getStore();
  store.examAttempts.push(event);
}

export async function clearAnalyticsData(): Promise<void> {
  const store = getStore();
  store.levelProgress = {};
  store.blockProgress = {};
  store.examAttempts = [];
  store.rounds = [];
  store.responses = [];
}

export function getWebAnalyticsStore(): WebAnalyticsStore {
  return getStore();
}
