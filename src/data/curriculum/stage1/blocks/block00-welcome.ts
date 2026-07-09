import { QuizQuestion, StageBlock } from '../../types';
import { baseConfig } from '../config';
import { theoryBlock00 } from '../theory';

const blockId = 'stage1-block0';

const partsQuiz: QuizQuestion[] = [
  {
    id: 'q-parts-1',
    prompt: '¿Qué parte amplifica el sonido de la guitarra?',
    options: [
      { id: 'a', label: 'Caja' },
      { id: 'b', label: 'Clavijero' },
      { id: 'c', label: 'Traste' },
    ],
    correctOptionId: 'a',
  },
  {
    id: 'q-parts-2',
    prompt: '¿Dónde están los trastes?',
    options: [
      { id: 'a', label: 'En el diapasón' },
      { id: 'b', label: 'En la boca' },
      { id: 'c', label: 'En el puente' },
    ],
    correctOptionId: 'a',
  },
];

const fingersQuiz: QuizQuestion[] = [
  {
    id: 'q-fingers-1',
    prompt: '¿Qué dedo de la mano izquierda es el índice?',
    options: [
      { id: 'a', label: '1' },
      { id: 'b', label: '2' },
      { id: 'c', label: 'p' },
    ],
    correctOptionId: 'a',
  },
  {
    id: 'q-fingers-2',
    prompt: '¿Qué letra indica el pulgar de la mano derecha?',
    options: [
      { id: 'a', label: 'p' },
      { id: 'b', label: 'i' },
      { id: 'c', label: '1' },
    ],
    correctOptionId: 'a',
  },
];

const staffQuiz: QuizQuestion[] = [
  {
    id: 'q-staff-1',
    prompt: '¿Cuántas líneas tiene el pentagrama?',
    options: [
      { id: 'a', label: '5' },
      { id: 'b', label: '4' },
      { id: 'c', label: '6' },
    ],
    correctOptionId: 'a',
  },
  {
    id: 'q-staff-2',
    prompt: 'Si una nota está más arriba en el pentagrama, suena…',
    options: [
      { id: 'a', label: 'Más aguda' },
      { id: 'b', label: 'Más grave' },
      { id: 'c', label: 'Igual' },
    ],
    correctOptionId: 'a',
  },
];

export const block00Welcome: StageBlock = {
  id: blockId,
  title: 'Bienvenido a la guitarra',
  description: 'Conoce el instrumento antes de empezar a leer y tocar notas.',
  order: 0,
  theory: theoryBlock00,
  requiresExamToUnlockNext: false,
  levels: [
    {
      id: `${blockId}-level1`,
      title: 'Partes de la guitarra',
      type: 'theory',
      objective: 'Conoce las partes principales de la guitarra.',
      theoryId: 'theory-stage1-block0-parts',
      config: baseConfig({ numberOfQuestions: 0, sound: false }),
    },
    {
      id: `${blockId}-level2`,
      title: 'Quiz: partes',
      type: 'quiz',
      objective: 'Identifica las partes de la guitarra.',
      config: baseConfig({ numberOfQuestions: partsQuiz.length, sound: false }),
      quizQuestions: partsQuiz,
      unlockAfterLevelId: `${blockId}-level1`,
    },
    {
      id: `${blockId}-level3`,
      title: 'Cuerdas de la guitarra',
      type: 'theory',
      objective: 'Aprende los nombres de las seis cuerdas.',
      theoryId: 'theory-stage1-block0-strings',
      config: baseConfig({ numberOfQuestions: 0 }),
      unlockAfterLevelId: `${blockId}-level2`,
    },
    {
      id: `${blockId}-level4`,
      title: 'Identifica cuerdas',
      type: 'fretboard',
      objective: 'Toca una cuerda al aire y escucha su sonido.',
      config: baseConfig({
        notes: [],
        strings: [1, 2, 3, 4, 5, 6],
        frets: [0],
        numberOfQuestions: 6,
        allowOnlyExactString: true,
      }),
      unlockAfterLevelId: `${blockId}-level3`,
    },
    {
      id: `${blockId}-level5`,
      title: 'Trastes',
      type: 'theory',
      objective: 'Entiende qué son los trastes.',
      theoryId: 'theory-stage1-block0-frets',
      config: baseConfig({ numberOfQuestions: 0 }),
      unlockAfterLevelId: `${blockId}-level4`,
    },
    {
      id: `${blockId}-level6`,
      title: 'Toca trastes',
      type: 'fretboard',
      objective: 'Pulsa cuerda y traste, escucha el audio.',
      config: baseConfig({
        notes: [],
        strings: [1, 2, 3, 4, 5, 6],
        frets: [0, 1, 2, 3],
        numberOfQuestions: 8,
      }),
      unlockAfterLevelId: `${blockId}-level5`,
    },
    {
      id: `${blockId}-level7`,
      title: 'Pentagrama y clave de Sol',
      type: 'theory',
      objective: 'Introducción al pentagrama.',
      theoryId: 'theory-stage1-block0-staff',
      config: baseConfig({ numberOfQuestions: 0 }),
      unlockAfterLevelId: `${blockId}-level6`,
    },
    {
      id: `${blockId}-level8`,
      title: 'Quiz: pentagrama',
      type: 'quiz',
      objective: 'Identifica conceptos del pentagrama.',
      config: baseConfig({ numberOfQuestions: staffQuiz.length, sound: false }),
      quizQuestions: staffQuiz,
      unlockAfterLevelId: `${blockId}-level7`,
    },
    {
      id: `${blockId}-level9`,
      title: 'Dedos',
      type: 'theory',
      objective: 'Nombres de los dedos de ambas manos.',
      theoryId: 'theory-stage1-block0-fingers',
      config: baseConfig({ numberOfQuestions: 0, sound: false }),
      unlockAfterLevelId: `${blockId}-level8`,
    },
    {
      id: `${blockId}-level10`,
      title: 'Quiz: dedos',
      type: 'quiz',
      objective: 'Identifica los dedos correctamente.',
      config: baseConfig({ numberOfQuestions: fingersQuiz.length, sound: false }),
      quizQuestions: fingersQuiz,
      unlockAfterLevelId: `${blockId}-level9`,
    },
  ],
};
