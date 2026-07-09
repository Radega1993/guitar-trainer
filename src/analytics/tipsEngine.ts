import { NoteHotspot, StatsKpis, StatsTip, StringHotspot, TrendPoint } from './types';

function formatPct(value: number): string {
  return `${Math.round(value)}%`;
}

function topNoteTip(note: NoteHotspot): StatsTip {
  return {
    id: `note-${note.note}`,
    severity: note.errorRatePct >= 60 ? 'high' : 'medium',
    text: `La nota ${note.note} es tu principal punto débil (${formatPct(
      note.errorRatePct
    )} de error). Repite 2 rondas enfocando esa nota.`,
  };
}

function topStringTip(stringRow: StringHotspot): StatsTip {
  return {
    id: `string-${stringRow.string}`,
    severity: stringRow.errorRatePct >= 55 ? 'high' : 'medium',
    text: `Fallas más en la ${stringRow.string}.ª cuerda. Practica al aire y trastes 1–3 en tempo lento.`,
  };
}

function fluencyTip(avgResponseSeconds: number): StatsTip {
  return {
    id: 'fluency',
    severity: 'low',
    text: `Tu precisión va bien, pero tardas ${avgResponseSeconds.toFixed(
      1
    )}s de media. Haz rondas cortas buscando lectura más fluida.`,
  };
}

function negativeTrendTip(): StatsTip {
  return {
    id: 'trend-down',
    severity: 'medium',
    text: 'Tu precisión cae en los últimos días. Repite un nivel ya dominado para consolidar antes de avanzar.',
  };
}

export function buildTips(params: {
  kpis: StatsKpis;
  worstNotes: NoteHotspot[];
  worstStrings: StringHotspot[];
  trend: TrendPoint[];
}): StatsTip[] {
  const tips: StatsTip[] = [];
  const { kpis, worstNotes, worstStrings, trend } = params;

  const note = worstNotes[0];
  if (note && note.attempts >= 6 && note.errorRatePct >= 45) {
    tips.push(topNoteTip(note));
  }

  const stringRow = worstStrings[0];
  if (stringRow && stringRow.attempts >= 8 && stringRow.errorRatePct >= 40) {
    tips.push(topStringTip(stringRow));
  }

  if (kpis.accuracyPct >= 75 && kpis.avgResponseSeconds > 3.5) {
    tips.push(fluencyTip(kpis.avgResponseSeconds));
  }

  if (trend.length >= 3) {
    const tail = trend.slice(-3).map((t) => t.accuracyPct);
    if (tail[0] > tail[1] && tail[1] > tail[2]) {
      tips.push(negativeTrendTip());
    }
  }

  if (tips.length === 0) {
    tips.push({
      id: 'default',
      severity: 'low',
      text: 'Buen trabajo. Mantén la constancia diaria y busca precisión por encima del 80%.',
    });
  }

  return tips.slice(0, 3);
}
