import { featureFlags } from '../../app/config/featureFlags';
import { INITIAL_STUDY_BLOCKS } from './blocks.initial';
import { StudyBlock } from './types';

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null;
}

function validateStudyBlock(raw: unknown): raw is StudyBlock {
  if (!isObject(raw)) return false;
  return (
    typeof raw.id === 'string' &&
    typeof raw.order === 'number' &&
    typeof raw.title === 'string' &&
    Array.isArray(raw.levels) &&
    Array.isArray(raw.theoryLessons)
  );
}

export function loadCurriculumFromJs(): StudyBlock[] {
  return INITIAL_STUDY_BLOCKS;
}

export function loadCurriculumFromJson(raw: unknown): StudyBlock[] {
  if (!Array.isArray(raw)) {
    throw new Error('Invalid curriculum JSON: expected an array of blocks');
  }
  if (!raw.every(validateStudyBlock)) {
    throw new Error('Invalid curriculum JSON: one or more blocks are malformed');
  }
  return raw;
}

export async function resolveCurriculumSource(params?: {
  mode?: 'js' | 'json' | 'remote-json';
  jsonRaw?: unknown;
  fetcher?: () => Promise<unknown>;
}): Promise<StudyBlock[]> {
  const mode = params?.mode ?? featureFlags.curriculumSource;
  if (mode === 'js') return loadCurriculumFromJs();
  if (mode === 'json') return loadCurriculumFromJson(params?.jsonRaw ?? []);
  const raw = params?.fetcher ? await params.fetcher() : [];
  return loadCurriculumFromJson(raw);
}

