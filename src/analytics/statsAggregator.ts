import {
  queryDailyAccuracy,
  queryKpis,
  queryWorstNotes,
  queryWorstStrings,
} from '../storage/sqlite/statsRepository';
import { buildUserStatsViewModel } from './statsModel';
import { StatsTimeFilter, UserStatsViewModel } from './types';

export async function loadUserStats(filter: StatsTimeFilter): Promise<UserStatsViewModel> {
  const days = filter === 0 ? null : filter;
  const trendDays = filter === 7 ? 7 : 14;

  const [kpis, worstNotesRaw, worstStringsRaw, dailyRaw] = await Promise.all([
    queryKpis(days),
    queryWorstNotes(days),
    queryWorstStrings(days),
    queryDailyAccuracy(trendDays),
  ]);

  return buildUserStatsViewModel({
    kpis,
    worstNotesRaw,
    worstStringsRaw,
    dailyRaw,
    trendDays,
  });
}
