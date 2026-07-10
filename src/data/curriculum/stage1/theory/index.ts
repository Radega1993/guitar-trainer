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
    id: 'theory-stage1-block1-welcome',
    title: 'Bienvenida',
    pages: [
      {
        title: 'Primera cuerda',
        body:
          'Bienvenido al Bloque 1 — Primera cuerda.\n\n' +
          'En este bloque aprenderás a leer, reconocer y tocar las tres primeras notas de la primera cuerda de la guitarra clásica:\n\n' +
          'Mi / E\nFa / F\nSol / G\n\n' +
          'Al finalizar, podrás mirar una nota en el pentagrama y tocarla correctamente en la primera cuerda sin dudar.',
      },
    ],
  },
  {
    id: 'theory-stage1-block1-t1',
    title: 'La primera cuerda',
    pages: [
      {
        title: 'La primera cuerda',
        body:
          'La primera cuerda de la guitarra es la cuerda más fina y aguda.\n\n' +
          'Cuando la tocamos sin pisar ningún traste, suena la nota Mi.\n\n' +
          'A tocar una cuerda sin pisar ningún traste lo llamamos tocar la cuerda al aire.',
        image: {
          asset: 't1p1',
          caption: 'La 1ª cuerda al aire suena Mi / E.',
          attribution: 'Guitar Trainer',
        },
      },
      {
        title: 'La cuerda más aguda',
        body:
          'En la guitarra, las cuerdas se cuentan desde abajo hacia arriba cuando miras el instrumento en posición de tocar.\n\n' +
          'La primera cuerda está abajo visualmente, pero es la más aguda.\n\n' +
          'Esto puede parecer extraño al principio, pero lo aprenderás rápido con la práctica.',
        image: {
          asset: 't1p2',
          caption: '1ª cuerda = más aguda · 6ª cuerda = más grave.',
          attribution: 'Guitar Trainer',
        },
      },
    ],
  },
  {
    id: 'theory-stage1-block1-t2',
    title: 'Mi / E',
    pages: [
      {
        title: 'Mi en la primera cuerda',
        body:
          'La primera nota que aprenderás es Mi.\n\n' +
          'Mi se toca en la primera cuerda al aire. Eso significa:\n\n' +
          'Cuerda: 1\nTraste: 0\nNota: Mi / E\n\n' +
          'No necesitas pulsar ningún traste con la mano izquierda.',
        image: {
          asset: 't2p1',
          caption: 'Mi / E — cuerda 1, traste 0.',
          attribution: 'Guitar Trainer',
        },
      },
      {
        title: 'Mi en el pentagrama',
        body:
          'En el pentagrama, Mi de la primera cuerda se coloca en la primera línea.\n\n' +
          'Esta será una de tus notas de referencia.\n\n' +
          'Cuando veas esta nota, piensa: “Primera cuerda al aire”.',
        image: {
          asset: 't2p2',
          caption: 'Mi en la primera línea del pentagrama.',
          attribution: 'Guitar Trainer',
        },
      },
    ],
  },
  {
    id: 'theory-stage1-block1-t3',
    title: 'Fa / F',
    pages: [
      {
        title: 'Fa en la primera cuerda',
        body:
          'La segunda nota es Fa.\n\n' +
          'Fa se toca en la primera cuerda, traste 1. Para tocarla, coloca el dedo 1 de la mano izquierda justo detrás del primer traste.\n\n' +
          'Cuerda: 1\nTraste: 1\nDedo: 1\nNota: Fa / F',
        image: {
          asset: 't3p1',
          caption: 'Fa / F — cuerda 1, traste 1, dedo 1.',
          attribution: 'Guitar Trainer',
        },
      },
      {
        title: 'Fa está justo encima de Mi',
        body:
          'En el pentagrama, Fa está en el primer espacio.\n\n' +
          'Mi está en la primera línea. Fa está justo encima.\n\n' +
          'Esto te ayuda a leer mejor: cuando la nota sube en el pentagrama, también sube el sonido.',
        image: {
          asset: 't3p2',
          caption: 'Mi en la línea, Fa en el espacio de encima.',
          attribution: 'Guitar Trainer',
        },
      },
    ],
  },
  {
    id: 'theory-stage1-block1-t4',
    title: 'Sol / G',
    pages: [
      {
        title: 'Sol en la primera cuerda',
        body:
          'La tercera nota es Sol.\n\n' +
          'Sol se toca en la primera cuerda, traste 3. Normalmente se usa el dedo 3 de la mano izquierda.\n\n' +
          'Cuerda: 1\nTraste: 3\nDedo: 3\nNota: Sol / G',
        image: {
          asset: 't4p1',
          caption: 'Sol / G — cuerda 1, traste 3, dedo 3.',
          attribution: 'Guitar Trainer',
        },
      },
      {
        title: 'Mi, Fa y Sol',
        body:
          'Ahora ya conoces tres notas seguidas en la primera cuerda:\n\n' +
          'Mi al aire.\nFa en el traste 1.\nSol en el traste 3.\n\n' +
          'Estas tres notas serán la base de tus primeros ejercicios de lectura.',
        image: {
          asset: 't4p2',
          caption: 'Tres posiciones en la 1ª cuerda: trastes 0, 1 y 3.',
          attribution: 'Guitar Trainer',
        },
      },
    ],
  },
  {
    id: 'theory-stage1-block1-t5',
    title: 'Leer de abajo hacia arriba',
    pages: [
      {
        title: 'Las notas suben',
        body:
          'Cuando una nota aparece más arriba en el pentagrama, su sonido es más agudo.\n\n' +
          'En la primera cuerda:\n\n' +
          'Mi está más abajo.\nFa está un poco más arriba.\nSol está todavía más arriba.\n\n' +
          'Por eso leer música también es aprender a reconocer alturas.',
        image: {
          asset: 't5p1',
          caption: 'Mi, Fa y Sol ascendentes en el pentagrama.',
          attribution: 'Guitar Trainer',
        },
      },
      {
        title: 'Relación entre pentagrama y mástil',
        body:
          'La partitura te dice qué nota tocar. El mástil te dice dónde tocarla.\n\n' +
          'En este bloque, cada nota tiene una posición clara:\n\n' +
          'Mi: cuerda 1, traste 0.\nFa: cuerda 1, traste 1.\nSol: cuerda 1, traste 3.',
        image: {
          asset: 't5p2',
          caption: 'Pentagrama y mástil: misma secuencia Mi, Fa, Sol.',
          attribution: 'Guitar Trainer',
        },
      },
    ],
  },
  {
    id: 'theory-stage1-block1-t6',
    title: 'Dedos recomendados',
    pages: [
      {
        title: 'Dedo 1 y dedo 3',
        body:
          'Para tocar en primera posición, usamos normalmente:\n\n' +
          'Fa con dedo 1.\nSol con dedo 3.\n\n' +
          'El dedo debe colocarse justo detrás del traste, no encima del metal ni demasiado lejos. Así el sonido será más limpio.',
        image: {
          asset: 't6p1',
          caption: 'Dedo 1 en traste 1 y dedo 3 en traste 3.',
          attribution: 'Guitar Trainer',
        },
      },
      {
        title: 'Consejo técnico',
        body:
          'No aprietes más de lo necesario.\n\n' +
          'Coloca el dedo cerca del traste y toca con calma.\n\n' +
          'El objetivo de este bloque no es tocar rápido, sino reconocer bien Mi, Fa y Sol. La velocidad llegará después.',
        image: {
          asset: 't6p2',
          caption: 'Coloca el dedo justo detrás del traste.',
          attribution: 'Guitar Trainer',
        },
      },
    ],
  },
  {
    id: 'theory-stage1-block1-t7',
    title: 'Preparación para la lectura animada',
    pages: [
      {
        title: 'Leer antes de tocar',
        body:
          'En los ejercicios animados, las notas se moverán de derecha a izquierda.\n\n' +
          'Mira la nota que se acerca al centro e intenta reconocerla antes de que se pare.\n\n' +
          'Esto entrena tu lectura como si estuvieras leyendo una partitura real.',
        image: {
          asset: 'exercise-scrolling-preview',
          caption: 'Vista real del pentagrama y del mastil como en los ejercicios.',
          attribution: 'Render en app · Guitar Trainer',
        },
      },
      {
        title: 'No memorices botones',
        body:
          'No intentes responder por memoria visual del juego.\n\n' +
          'Mira la partitura, reconoce la nota y después busca su posición en el mástil.\n\n' +
          'El orden correcto es:\n\n' +
          'Veo la nota.\nDigo su nombre.\nLa encuentro en la guitarra.\nLa toco.',
        image: {
          asset: 'exercise-flow-preview',
          caption: 'Pentagrama -> nombre -> mastil -> sonido.',
          attribution: 'Flujo didactico · Guitar Trainer',
        },
      },
    ],
  },
  {
    id: 'theory-stage1-block1-summary',
    title: 'Resumen del bloque',
    pages: [
      {
        title: 'Ya conoces la primera cuerda',
        body:
          'En este bloque has aprendido:\n\n' +
          'Mi / E — primera cuerda al aire.\n' +
          'Fa / F — primera cuerda, traste 1.\n' +
          'Sol / G — primera cuerda, traste 3.\n\n' +
          'Ahora puedes empezar a leer tus primeras notas en guitarra clásica.',
        image: {
          asset: 't5p2',
          caption: 'Resumen visual: relacion entre pentagrama y mastil.',
          attribution: 'Guitar Trainer',
        },
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
