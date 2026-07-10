import { QuizQuestion, StageBlock, StageLevel } from '../../types';
import { baseConfig } from '../config';
import {
  examLevel,
  fretboardLevel,
  miniStudyLevel,
  mixLevel,
  recognitionLevel,
  scrollingLevel,
  speedLevel,
  theoryLevel,
} from '../levelFactory';
import { theoryBlock01 } from '../theory';

const blockId = 'stage1-block1';

const notes = [
  { label: 'E4', latin: 'Mi', string: 1, fret: 0 },
  { label: 'F4', latin: 'Fa', string: 1, fret: 1 },
  { label: 'G4', latin: 'Sol', string: 1, fret: 3 },
] as const;

const string1IntroQuiz: QuizQuestion[] = [
  {
    id: 'q-b1-t1-1',
    prompt: '¿Cuál es la cuerda más aguda de la guitarra?',
    options: [
      { id: 'a', label: 'La 1ª cuerda' },
      { id: 'b', label: 'La 6ª cuerda' },
      { id: 'c', label: 'La 3ª cuerda' },
    ],
    correctOptionId: 'a',
  },
  {
    id: 'q-b1-t1-2',
    prompt: '¿Desde dónde se numeran las cuerdas en posición de tocar?',
    options: [
      { id: 'a', label: 'Desde abajo hacia arriba' },
      { id: 'b', label: 'Desde arriba hacia abajo' },
      { id: 'c', label: 'Desde el puente al clavijero' },
    ],
    correctOptionId: 'a',
  },
  {
    id: 'q-b1-t1-3',
    prompt: '¿Qué significa tocar una cuerda al aire?',
    options: [
      { id: 'a', label: 'Sin pisar ningún traste' },
      { id: 'b', label: 'Pisando el traste 1' },
      { id: 'c', label: 'Tocando muy fuerte' },
    ],
    correctOptionId: 'a',
  },
];

const miQuiz: QuizQuestion[] = [
  {
    id: 'q-b1-mi-1',
    prompt: '¿Qué nota suena la 1ª cuerda al aire?',
    options: [
      { id: 'a', label: 'Mi / E' },
      { id: 'b', label: 'Fa / F' },
      { id: 'c', label: 'Sol / G' },
    ],
    correctOptionId: 'a',
  },
  {
    id: 'q-b1-mi-2',
    prompt: '¿En qué traste se toca Mi en la 1ª cuerda?',
    options: [
      { id: 'a', label: 'Traste 1' },
      { id: 'b', label: 'Traste 0' },
      { id: 'c', label: 'Traste 3' },
    ],
    correctOptionId: 'b',
  },
  {
    id: 'q-b1-mi-3',
    prompt: '¿Dónde se escribe Mi de la 1ª cuerda en el pentagrama?',
    options: [
      { id: 'a', label: 'En el primer espacio' },
      { id: 'b', label: 'En la tercera línea' },
      { id: 'c', label: 'En la primera línea' },
    ],
    correctOptionId: 'c',
  },
];

const faQuiz: QuizQuestion[] = [
  {
    id: 'q-b1-fa-1',
    prompt: '¿Dónde se toca Fa en la guitarra?',
    options: [
      { id: 'a', label: 'Cuerda 1, traste 1' },
      { id: 'b', label: 'Cuerda 1, traste 0' },
      { id: 'c', label: 'Cuerda 2, traste 1' },
    ],
    correctOptionId: 'a',
  },
  {
    id: 'q-b1-fa-2',
    prompt: '¿Qué dedo se usa normalmente para Fa?',
    options: [
      { id: 'a', label: 'Dedo 1' },
      { id: 'b', label: 'Dedo 3' },
      { id: 'c', label: 'Dedo 4' },
    ],
    correctOptionId: 'a',
  },
  {
    id: 'q-b1-fa-3',
    prompt: 'En el pentagrama, Fa está…',
    options: [
      { id: 'a', label: 'En el primer espacio, encima de Mi' },
      { id: 'b', label: 'En la primera línea' },
      { id: 'c', label: 'Debajo de Mi' },
    ],
    correctOptionId: 'a',
  },
  {
    id: 'q-b1-fa-4',
    prompt: 'Repaso: ¿dónde se toca Mi en la 1ª cuerda?',
    options: [
      { id: 'a', label: 'Traste 0' },
      { id: 'b', label: 'Traste 1' },
      { id: 'c', label: 'Traste 3' },
    ],
    correctOptionId: 'a',
  },
  {
    id: 'q-b1-fa-5',
    prompt: '¿Cuál es la secuencia correcta en la 1ª cuerda, de grave a agudo?',
    options: [
      { id: 'a', label: 'Mi -> Fa' },
      { id: 'b', label: 'Fa -> Mi' },
      { id: 'c', label: 'Fa -> Sol -> Mi' },
    ],
    correctOptionId: 'a',
  },
];

const solQuiz: QuizQuestion[] = [
  {
    id: 'q-b1-sol-1',
    prompt: '¿Dónde se toca Sol en la 1ª cuerda?',
    options: [
      { id: 'a', label: 'Traste 3' },
      { id: 'b', label: 'Traste 1' },
      { id: 'c', label: 'Traste 2' },
    ],
    correctOptionId: 'a',
  },
  {
    id: 'q-b1-sol-2',
    prompt: '¿Qué dedo se usa normalmente para Sol?',
    options: [
      { id: 'a', label: 'Dedo 3' },
      { id: 'b', label: 'Dedo 1' },
      { id: 'c', label: 'Dedo 2' },
    ],
    correctOptionId: 'a',
  },
  {
    id: 'q-b1-sol-3',
    prompt: 'De Mi, Fa y Sol, ¿cuál está más arriba en el pentagrama?',
    options: [
      { id: 'a', label: 'Sol' },
      { id: 'b', label: 'Mi' },
      { id: 'c', label: 'Fa' },
    ],
    correctOptionId: 'a',
  },
  {
    id: 'q-b1-sol-4',
    prompt: 'Repaso: ¿qué nota está en la 1ª cuerda, traste 0?',
    options: [
      { id: 'a', label: 'Mi / E' },
      { id: 'b', label: 'Fa / F' },
      { id: 'c', label: 'Sol / G' },
    ],
    correctOptionId: 'a',
  },
  {
    id: 'q-b1-sol-5',
    prompt: 'Repaso: ¿qué nota está en la 1ª cuerda, traste 1?',
    options: [
      { id: 'a', label: 'Sol / G' },
      { id: 'b', label: 'Mi / E' },
      { id: 'c', label: 'Fa / F' },
    ],
    correctOptionId: 'c',
  },
  {
    id: 'q-b1-sol-6',
    prompt: 'Ordena las tres notas de la 1ª cuerda de abajo hacia arriba en el pentagrama:',
    options: [
      { id: 'a', label: 'Mi -> Fa -> Sol' },
      { id: 'b', label: 'Sol -> Fa -> Mi' },
      { id: 'c', label: 'Fa -> Mi -> Sol' },
    ],
    correctOptionId: 'a',
  },
];

const staffQuiz: QuizQuestion[] = [
  {
    id: 'q-b1-staff-1',
    prompt: 'Si una nota sube en el pentagrama, su sonido es…',
    options: [
      { id: 'a', label: 'Más agudo' },
      { id: 'b', label: 'Más grave' },
      { id: 'c', label: 'Igual' },
    ],
    correctOptionId: 'a',
  },
  {
    id: 'q-b1-staff-2',
    prompt: '¿Qué te dice el pentagrama y qué el mástil?',
    options: [
      { id: 'a', label: 'Pentagrama: qué nota · Mástil: dónde tocarla' },
      { id: 'b', label: 'Pentagrama: qué dedo · Mástil: qué cuerda' },
      { id: 'c', label: 'Ambos dicen lo mismo' },
    ],
    correctOptionId: 'a',
  },
];

const fingersQuiz: QuizQuestion[] = [
  {
    id: 'q-b1-fingers-1',
    prompt: '¿Con qué dedo tocamos Fa normalmente?',
    options: [
      { id: 'a', label: 'Dedo 1' },
      { id: 'b', label: 'Dedo 3' },
      { id: 'c', label: 'Pulgar' },
    ],
    correctOptionId: 'a',
  },
  {
    id: 'q-b1-fingers-2',
    prompt: '¿Dónde debe colocarse el dedo al pisar un traste?',
    options: [
      { id: 'a', label: 'Justo detrás del traste' },
      { id: 'b', label: 'Encima del metal del traste' },
      { id: 'c', label: 'Muy lejos del traste' },
    ],
    correctOptionId: 'a',
  },
];

const readingQuiz: QuizQuestion[] = [
  {
    id: 'q-b1-read-1',
    prompt: '¿Cuál es el orden correcto al leer una nota?',
    options: [
      { id: 'a', label: 'Veo la nota → digo su nombre → la encuentro → la toco' },
      { id: 'b', label: 'Toco primero → luego miro el pentagrama' },
      { id: 'c', label: 'Memorizo la posición del botón' },
    ],
    correctOptionId: 'a',
  },
  {
    id: 'q-b1-read-2',
    prompt: 'En la lectura animada, las notas se mueven…',
    options: [
      { id: 'a', label: 'De derecha a izquierda' },
      { id: 'b', label: 'De arriba a abajo' },
      { id: 'c', label: 'Solo aparecen en el centro' },
    ],
    correctOptionId: 'a',
  },
];

function quizLevel(
  order: number,
  title: string,
  objective: string,
  questions: QuizQuestion[],
  prevId?: string
) {
  return {
    id: `${blockId}-level${order}`,
    title,
    type: 'quiz' as const,
    objective,
    config: baseConfig({ numberOfQuestions: questions.length, sound: false }),
    quizQuestions: questions,
    unlockAfterLevelId: prevId,
  };
}

export const block01String1: StageBlock = {
  id: blockId,
  title: 'Primera cuerda',
  description:
    'Lee, reconoce y toca Mi, Fa y Sol en la primera cuerda sin dudar.',
  order: 1,
  theory: theoryBlock01,
  requiresExamToUnlockNext: true,
  levels: (() => {
    const levels: StageLevel[] = [];
    let order = 1;
    let prev: string | undefined;

    const push = (level: StageLevel) => {
      levels.push(level);
      prev = level.id;
    };

    push(
      theoryLevel(
        blockId,
        order++,
        'Bienvenida',
        'theory-stage1-block1-welcome',
        'Objetivos del bloque Primera cuerda.'
      )
    );
    push(theoryLevel(blockId, order++, 'La primera cuerda', 'theory-stage1-block1-t1', 'Conoce la 1ª cuerda y su numeración.', prev));
    push(quizLevel(order++, 'Quiz: la primera cuerda', 'Comprueba lo aprendido sobre la 1ª cuerda.', string1IntroQuiz, prev));
    push(theoryLevel(blockId, order++, 'Mi / E', 'theory-stage1-block1-t2', 'Aprende Mi al aire en la 1ª cuerda.', prev));
    push(quizLevel(order++, 'Quiz: Mi', 'Identifica Mi en pentagrama y mástil.', miQuiz, prev));
    push(recognitionLevel(blockId, order++, notes[0], prev));
    push(fretboardLevel(blockId, order++, notes[0], prev));
    push(theoryLevel(blockId, order++, 'Fa / F', 'theory-stage1-block1-t3', 'Aprende Fa en el traste 1.', prev));
    push(quizLevel(order++, 'Quiz: Fa', 'Identifica Fa en pentagrama y mástil.', faQuiz, prev));
    push(recognitionLevel(blockId, order++, notes[1], prev));
    push(fretboardLevel(blockId, order++, notes[1], prev));
    push(theoryLevel(blockId, order++, 'Sol / G', 'theory-stage1-block1-t4', 'Aprende Sol en el traste 3.', prev));
    push(quizLevel(order++, 'Quiz: Sol', 'Identifica Sol en pentagrama y mástil.', solQuiz, prev));
    push(recognitionLevel(blockId, order++, notes[2], prev));
    push(fretboardLevel(blockId, order++, notes[2], prev));
    push(theoryLevel(blockId, order++, 'Leer de abajo hacia arriba', 'theory-stage1-block1-t5', 'Relaciona alturas del pentagrama con el mástil.', prev));
    push(quizLevel(order++, 'Quiz: pentagrama', 'Comprueba cómo leer alturas.', staffQuiz, prev));
    push(mixLevel(blockId, order++, 'Mezcla Mi y Fa', [notes[0], notes[1]], 10, prev));
    push(mixLevel(blockId, order++, 'Mezcla Mi, Fa y Sol', [...notes], 12, prev));
    push(theoryLevel(blockId, order++, 'Dedos recomendados', 'theory-stage1-block1-t6', 'Coloca bien los dedos en primera posición.', prev));
    push(quizLevel(order++, 'Quiz: dedos', 'Repasa la técnica de la mano izquierda.', fingersQuiz, prev));
    push(theoryLevel(blockId, order++, 'Lectura animada', 'theory-stage1-block1-t7', 'Prepárate para leer notas en movimiento.', prev));
    push(quizLevel(order++, 'Quiz: lectura', 'Entrena el orden correcto al leer.', readingQuiz, prev));
    push(scrollingLevel(blockId, order++, 'Lectura animada lenta', [...notes], 'slow', 10, prev));
    push(speedLevel(blockId, order++, 'Velocidad', [...notes], 10, prev));
    push(theoryLevel(blockId, order++, 'Resumen del bloque', 'theory-stage1-block1-summary', 'Repasa Mi, Fa y Sol antes del examen.', prev));
    push(miniStudyLevel(blockId, order++, 'Mini estudio', [...notes], 10, prev));
    push(examLevel(blockId, order++, 'Examen del bloque', [...notes], 12, prev));

    return levels;
  })(),
  examLevelId: `${blockId}-level28`,
};
