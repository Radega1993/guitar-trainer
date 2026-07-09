import { StageLevel, StageLevelConfig } from '../types';
import { baseConfig, notesConfig } from './config';

type NoteTriple = { label: string; latin: string; string: number; fret: number };

export function theoryLevel(
  blockId: string,
  order: number,
  title: string,
  theoryId: string,
  objective: string
): StageLevel {
  return {
    id: `${blockId}-level${order}`,
    title,
    type: 'theory',
    objective,
    theoryId,
    config: baseConfig({ numberOfQuestions: 0, sound: false }),
  };
}

export function recognitionLevel(
  blockId: string,
  order: number,
  note: NoteTriple,
  prevId?: string
): StageLevel {
  return {
    id: `${blockId}-level${order}`,
    title: `Reconoce ${note.latin}`,
    type: 'recognition',
    objective: `Identifica ${note.latin} (${note.label}) en el pentagrama.`,
    config: notesConfig([note.label], [note.string], [note.fret], { numberOfQuestions: 8 }),
    unlockAfterLevelId: prevId,
  };
}

export function fretboardLevel(
  blockId: string,
  order: number,
  note: NoteTriple,
  prevId?: string
): StageLevel {
  return {
    id: `${blockId}-level${order}`,
    title: `Ubica ${note.latin}`,
    type: 'fretboard',
    objective: `Toca ${note.latin} en cuerda ${note.string}, traste ${note.fret}.`,
    config: notesConfig([note.label], [note.string], [note.fret], { numberOfQuestions: 8 }),
    unlockAfterLevelId: prevId,
  };
}

export function mixLevel(
  blockId: string,
  order: number,
  title: string,
  notes: NoteTriple[],
  count: number,
  prevId?: string
): StageLevel {
  return {
    id: `${blockId}-level${order}`,
    title,
    type: 'fretboard',
    objective: `Localiza las notas mezcladas: ${notes.map((n) => n.latin).join(', ')}.`,
    config: notesConfig(
      notes.map((n) => n.label),
      [...new Set(notes.map((n) => n.string))],
      [...new Set(notes.map((n) => n.fret))],
      { numberOfQuestions: count }
    ),
    unlockAfterLevelId: prevId,
  };
}

export function compareLevel(
  blockId: string,
  order: number,
  title: string,
  notes: NoteTriple[],
  prevId?: string
): StageLevel {
  return {
    id: `${blockId}-level${order}`,
    title,
    type: 'recognition',
    objective: `Diferencia ${notes.map((n) => n.latin).join(' y ')}.`,
    config: notesConfig(
      notes.map((n) => n.label),
      [...new Set(notes.map((n) => n.string))],
      [...new Set(notes.map((n) => n.fret))],
      { numberOfQuestions: 10 }
    ),
    unlockAfterLevelId: prevId,
  };
}

export function scrollingLevel(
  blockId: string,
  order: number,
  title: string,
  notes: NoteTriple[],
  speed: 'slow' | 'normal' | 'fast',
  count: number,
  prevId?: string
): StageLevel {
  return {
    id: `${blockId}-level${order}`,
    title,
    type: 'scrolling_reading',
    objective: 'Lee las notas con animación y tócalas en el mástil.',
    config: notesConfig(
      notes.map((n) => n.label),
      [...new Set(notes.map((n) => n.string))],
      [...new Set(notes.map((n) => n.fret))],
      { numberOfQuestions: count, animation: true, animationSpeed: speed }
    ),
    unlockAfterLevelId: prevId,
  };
}

export function speedLevel(
  blockId: string,
  order: number,
  title: string,
  notes: NoteTriple[],
  count: number,
  prevId?: string
): StageLevel {
  return {
    id: `${blockId}-level${order}`,
    title,
    type: 'speed',
    objective: 'Responde con rapidez y precisión.',
    config: notesConfig(
      notes.map((n) => n.label),
      [...new Set(notes.map((n) => n.string))],
      [...new Set(notes.map((n) => n.fret))],
      { numberOfQuestions: count, timeLimitPerQuestion: 3 }
    ),
    unlockAfterLevelId: prevId,
  };
}

export function miniStudyLevel(
  blockId: string,
  order: number,
  title: string,
  notes: NoteTriple[],
  count: number,
  prevId?: string
): StageLevel {
  return {
    id: `${blockId}-level${order}`,
    title,
    type: 'mini_study',
    objective: 'Toca la secuencia melódica con fluidez.',
    config: notesConfig(
      notes.map((n) => n.label),
      [...new Set(notes.map((n) => n.string))],
      [...new Set(notes.map((n) => n.fret))],
      {
        numberOfQuestions: count,
        animation: true,
        animationSpeed: 'slow',
        preferStepwiseMotion: true,
        avoidRepeats: true,
      }
    ),
    unlockAfterLevelId: prevId,
  };
}

export function examLevel(
  blockId: string,
  order: number,
  title: string,
  notes: NoteTriple[],
  count: number,
  prevId?: string
): StageLevel {
  return {
    id: `${blockId}-level${order}`,
    title,
    type: 'exam',
    objective: 'Examen del bloque: demuestra lo aprendido.',
    config: notesConfig(
      notes.map((n) => n.label),
      [...new Set(notes.map((n) => n.string))],
      [...new Set(notes.map((n) => n.fret))],
      { numberOfQuestions: count, animation: true, animationSpeed: 'normal', difficulty: 'medium' }
    ),
    unlockAfterLevelId: prevId,
  };
}

export function repasoLevel(
  blockId: string,
  order: number,
  title: string,
  notes: NoteTriple[],
  prevId?: string
): StageLevel {
  return mixLevel(blockId, order, title, notes, 10, prevId);
}

/** Standard 3-note string block progression. */
export function stringBlockLevels(
  blockId: string,
  notes: [NoteTriple, NoteTriple, NoteTriple],
  miniCount: number,
  examCount = 12
): StageLevel[] {
  const levels: StageLevel[] = [];
  let order = 1;
  let prev: string | undefined;

  for (const note of notes) {
    const rec = recognitionLevel(blockId, order++, note, prev);
    levels.push(rec);
    prev = rec.id;
    const fret = fretboardLevel(blockId, order++, note, prev);
    levels.push(fret);
    prev = fret.id;
  }

  const mix2 = mixLevel(blockId, order++, `Mezcla ${notes[0].latin} y ${notes[1].latin}`, [notes[0], notes[1]], 10, prev);
  levels.push(mix2);
  prev = mix2.id;

  const mix3 = mixLevel(
    blockId,
    order++,
    `Mezcla ${notes.map((n) => n.latin).join(', ')}`,
    notes,
    12,
    prev
  );
  levels.push(mix3);
  prev = mix3.id;

  const scroll = scrollingLevel(blockId, order++, 'Lectura animada lenta', notes, 'slow', 10, prev);
  levels.push(scroll);
  prev = scroll.id;

  const spd = speedLevel(blockId, order++, 'Velocidad', notes, 10, prev);
  levels.push(spd);
  prev = spd.id;

  const mini = miniStudyLevel(blockId, order++, 'Mini estudio', notes, miniCount, prev);
  levels.push(mini);
  prev = mini.id;

  const exam = examLevel(blockId, order++, 'Examen del bloque', notes, examCount, prev);
  levels.push(exam);

  return levels;
}

export type { NoteTriple };
