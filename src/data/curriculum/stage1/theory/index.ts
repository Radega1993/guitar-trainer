import { TheoryContent } from '../../types';

export const theoryBlock00: TheoryContent[] = [
  {
    id: 'theory-stage1-block0-parts',
    title: 'Partes de la guitarra',
    pages: [
      {
        title: 'Conoce tu instrumento',
        body: 'La guitarra clásica tiene una caja resonante, un mástil con diapasón y seis cuerdas. Aprender sus partes te ayuda a orientarte.',
        image: {
          asset: 'guitar-parts',
          caption: 'Vista de la guitarra clásica: caja, mástil y cuerdas.',
          attribution: 'Diagrama pedagógico · Guitar Trainer',
        },
      },
      {
        title: 'Partes principales',
        body: 'Caja: amplifica el sonido. Boca: abertura de la caja. Mástil: donde va la mano izquierda. Diapasón: superficie con trastes. Trastes: barras metálicas que cambian la altura. Cuerdas: 6, de la 1 (aguda) a la 6 (grave). Puente: sujeta las cuerdas en la caja. Clavijero: afinación.',
        image: {
          asset: 'guitar-parts',
          caption: 'Identifica caja, mástil, trastes y clavijero.',
          attribution: 'Diagrama pedagógico · Guitar Trainer',
        },
      },
    ],
  },
  {
    id: 'theory-stage1-block0-strings',
    title: 'Cuerdas de la guitarra',
    pages: [
      {
        title: 'Seis cuerdas',
        body: 'La guitarra clásica tiene 6 cuerdas. La cuerda 1 es la más fina y aguda. La cuerda 6 es la más gruesa y grave.',
        image: {
          asset: 'guitar-strings',
          caption: 'Las cuerdas van de la 1 (Mi agudo) a la 6 (Mi grave).',
          attribution: 'Diagrama pedagógico · Guitar Trainer',
        },
      },
      {
        title: 'Nombres al aire',
        body: '1ª cuerda: Mi. 2ª: Si. 3ª: Sol. 4ª: Re. 5ª: La. 6ª: Mi. Toca cada cuerda al aire y escucha su sonido.',
        image: {
          asset: 'guitar-strings',
          attribution: 'Diagrama pedagógico · Guitar Trainer',
        },
      },
    ],
  },
  {
    id: 'theory-stage1-block0-frets',
    title: 'Trastes',
    pages: [
      {
        title: 'Qué es un traste',
        body: 'El traste cambia la altura de la nota. Cada traste sube un semitono. En esta etapa usaremos trastes 0, 1, 2 y 3.',
        image: {
          asset: 'guitar-frets',
          caption: 'Cada traste sube la nota un semitono.',
          attribution: 'Diagrama pedagógico · Guitar Trainer',
        },
      },
      {
        title: 'Primera posición',
        body: 'Traste 0 es la cuerda al aire. Traste 1, 2 y 3 están cerca del clavijero. Es la zona donde empezarás a tocar.',
        image: {
          asset: 'guitar-frets',
          attribution: 'Diagrama pedagógico · Guitar Trainer',
        },
      },
    ],
  },
  {
    id: 'theory-stage1-block0-staff',
    title: 'Pentagrama y clave de Sol',
    pages: [
      {
        title: 'El pentagrama',
        body: 'El pentagrama tiene 5 líneas horizontales. Las notas se escriben en líneas y espacios. Cuanto más arriba, más aguda es la nota.',
        image: {
          asset: 'treble-staff',
          caption: 'Cinco líneas: las notas suben o bajan en altura.',
          attribution: 'Diagrama pedagógico · Guitar Trainer',
        },
      },
      {
        title: 'Clave de Sol',
        body: 'La clave de Sol nos ayuda a ubicar las notas. En guitarra se lee habitualmente en clave de Sol. Practica mirar si la nota sube o baja en el pentagrama.',
        image: {
          asset: 'treble-staff',
          attribution: 'Diagrama pedagógico · Guitar Trainer',
        },
      },
    ],
  },
  {
    id: 'theory-stage1-block0-fingers',
    title: 'Dedos',
    pages: [
      {
        title: 'Mano izquierda',
        body: '1 = índice. 2 = medio. 3 = anular. 4 = meñique. Los números indican qué dedo pisar el traste.',
        image: {
          asset: 'hand-fingers',
          caption: 'Mano izquierda: dedos numerados del 1 al 4.',
          attribution: 'Diagrama pedagógico · Guitar Trainer',
        },
      },
      {
        title: 'Mano derecha',
        body: 'p = pulgar. i = índice. m = medio. a = anular. En guitarra clásica la mano derecha toca las cuerdas con estos dedos.',
        image: {
          asset: 'hand-fingers',
          caption: 'Mano derecha: p, i, m, a.',
          attribution: 'Diagrama pedagógico · Guitar Trainer',
        },
      },
    ],
  },
];

export const theoryBlock01: TheoryContent[] = [
  {
    id: 'theory-stage1-block1-intro',
    title: 'La primera cuerda',
    pages: [
      {
        title: 'La cuerda más aguda',
        body: 'La primera cuerda de la guitarra es la cuerda más fina y aguda. Al tocarla al aire suena Mi.',
      },
      {
        title: 'Tres primeras notas',
        body: 'En primera posición aprenderás Mi al aire (traste 0), Fa en el traste 1 y Sol en el traste 3.',
      },
      {
        title: 'Dedos recomendados',
        body: 'Usa el dedo 1 para Fa y el dedo 3 para Sol. Mantén la mano relajada y cerca del diapasón.',
      },
    ],
  },
];

export const theoryBlock02: TheoryContent[] = [
  {
    id: 'theory-stage1-block2-intro',
    title: 'La segunda cuerda',
    pages: [
      {
        title: 'Si al aire',
        body: 'La segunda cuerda al aire suena Si. Es más grave que la primera cuerda.',
      },
      {
        title: 'Do y Re',
        body: 'Traste 1 es Do. Traste 3 es Re. Estas notas se leen más abajo en el pentagrama que las de la primera cuerda.',
      },
    ],
  },
];

export const theoryBlock03: TheoryContent[] = [
  {
    id: 'theory-stage1-block3-intro',
    title: 'Primera y segunda cuerda',
    pages: [
      {
        title: 'Elegir la cuerda',
        body: 'Ahora debes leer la nota y decidir en qué cuerda tocarla. La altura en el pentagrama te orienta.',
      },
      {
        title: 'Cambio de cuerda',
        body: 'Las notas de segunda cuerda son más graves que las de primera. Practica cambios suaves entre cuerdas.',
      },
    ],
  },
];

export const theoryBlock04: TheoryContent[] = [
  {
    id: 'theory-stage1-block4-intro',
    title: 'La tercera cuerda',
    pages: [
      {
        title: 'Sol al aire',
        body: 'La tercera cuerda al aire es Sol. Traste 2 es La. Usa el dedo 2 para La en primera posición.',
      },
      {
        title: 'Dos octavas de Sol',
        body: 'Hay Sol en primera cuerda y Sol en tercera cuerda, pero son octavas diferentes. Fíjate en la altura del pentagrama.',
      },
    ],
  },
];

export const theoryBlock05: TheoryContent[] = [
  {
    id: 'theory-stage1-block5-intro',
    title: 'Tres primeras cuerdas',
    pages: [
      {
        title: 'Un registro melódico',
        body: 'Ya tienes notas desde Sol grave hasta Sol agudo. Puedes tocar melodías completas en tres cuerdas.',
      },
      {
        title: 'Misma letra, distinta altura',
        body: 'Una misma letra (Mi, Sol, Do…) puede aparecer en distintas octavas. La posición en el pentagrama lo indica.',
      },
    ],
  },
];

export const theoryBlock06: TheoryContent[] = [
  {
    id: 'theory-stage1-block6-intro',
    title: 'La cuarta cuerda',
    pages: [
      {
        title: 'Re al aire',
        body: 'La cuarta cuerda al aire es Re. Traste 2 es Mi y traste 3 es Fa.',
      },
      {
        title: 'Notas graves',
        body: 'Estas notas suelen funcionar como bajos o melodía grave en guitarra clásica.',
      },
    ],
  },
];

export const theoryBlock07: TheoryContent[] = [
  {
    id: 'theory-stage1-block7-intro',
    title: 'Cinco primeras cuerdas',
    pages: [
      {
        title: 'La quinta cuerda',
        body: 'La quinta cuerda al aire es La. Traste 2 es Si y traste 3 es Do. Son notas graves muy usadas como bajos.',
      },
      {
        title: 'Casi todo el registro',
        body: 'Con cinco cuerdas cubres casi todo el registro básico de la guitarra en primera posición.',
      },
    ],
  },
];

export const theoryBlock08: TheoryContent[] = [
  {
    id: 'theory-stage1-block8-intro',
    title: 'La sexta cuerda',
    pages: [
      {
        title: 'La cuerda más grave',
        body: 'La sexta cuerda es la más grave. Al aire es Mi. Traste 1 es Fa y traste 3 es Sol.',
      },
      {
        title: 'Líneas adicionales',
        body: 'Visualmente estas notas requieren líneas adicionales graves en el pentagrama. Relaciona cada nota con su sonido.',
      },
    ],
  },
];

export const theoryBlock09: TheoryContent[] = [
  {
    id: 'theory-stage1-block9-intro',
    title: 'Primera posición completa',
    pages: [
      {
        title: 'Todas las notas naturales',
        body: 'La primera posición cubre las notas naturales principales. Cada cuerda tiene notas al aire y pisadas.',
      },
      {
        title: 'Automatizar',
        body: 'El objetivo ya no es memorizar, sino automatizar. Lee altura, cuerda y posición con rapidez.',
      },
    ],
  },
];
