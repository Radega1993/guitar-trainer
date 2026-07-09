export type StageAvailability = 'active' | 'locked' | 'coming_soon' | 'post_mvp';

export type GrowthIcon = 'seed' | 'sprout' | 'tree' | 'mastery' | 'virtuoso';

export interface RoadmapBlock {
  id: string;
  title: string;
  /** Links to curriculum block id when implemented. */
  curriculumBlockId?: string;
}

export interface RoadmapStage {
  id: string;
  order: number;
  icon: GrowthIcon;
  emoji: string;
  title: string;
  objective: string;
  outcome: string;
  availability: StageAvailability;
  blocks: RoadmapBlock[];
}

export const CURRICULUM_ROADMAP: RoadmapStage[] = [
  {
    id: 'stage-1',
    order: 1,
    icon: 'seed',
    emoji: '🌱',
    title: 'Descubrir la guitarra',
    objective: 'Aprender a leer música y localizar todas las notas naturales en primera posición.',
    outcome: 'Ya sabes leer y tocar cualquier nota natural en primera posición.',
    availability: 'active',
    blocks: [
      { id: 'rb-s1-guitar', title: 'Bienvenido a la guitarra', curriculumBlockId: 'stage1-block0' },
      { id: 'rb-s1-s1', title: 'Primera cuerda', curriculumBlockId: 'stage1-block1' },
      { id: 'rb-s1-s2', title: 'Segunda cuerda', curriculumBlockId: 'stage1-block2' },
      { id: 'rb-s1-s12', title: 'Primera + segunda cuerda', curriculumBlockId: 'stage1-block3' },
      { id: 'rb-s1-s3', title: 'Tercera cuerda', curriculumBlockId: 'stage1-block4' },
      { id: 'rb-s1-s123', title: 'Tres primeras cuerdas', curriculumBlockId: 'stage1-block5' },
      { id: 'rb-s1-s4', title: 'Cuarta cuerda', curriculumBlockId: 'stage1-block6' },
      { id: 'rb-s1-s15', title: 'Cinco primeras cuerdas', curriculumBlockId: 'stage1-block7' },
      { id: 'rb-s1-s6', title: 'Sexta cuerda', curriculumBlockId: 'stage1-block8' },
      { id: 'rb-s1-full', title: 'Primera posición completa', curriculumBlockId: 'stage1-block9' },
    ],
  },
  {
    id: 'stage-2',
    order: 2,
    icon: 'sprout',
    emoji: '🌿',
    title: 'Consolidar los fundamentos',
    objective: 'Convertir la lectura y el ritmo en algo automático.',
    outcome: 'Lees partituras sencillas con ritmo y soltura.',
    availability: 'coming_soon',
    blocks: [
      { id: 'rb-s2-acc', title: 'Accidentales' },
      { id: 'rb-s2-chrom', title: 'Cromatismo' },
      { id: 'rb-s2-int', title: 'Intervalos' },
      { id: 'rb-s2-scales', title: 'Escalas' },
      { id: 'rb-s2-meter', title: 'Compases' },
      { id: 'rb-s2-rest', title: 'Silencios' },
      { id: 'rb-s2-slur', title: 'Ligaduras' },
      { id: 'rb-s2-dot', title: 'Puntillo' },
      { id: 'rb-s2-fermata', title: 'Calderón' },
      { id: 'rb-s2-repeat', title: 'Repeticiones' },
      { id: 'rb-s2-pos1', title: 'Dominio de la primera posición' },
    ],
  },
  {
    id: 'stage-3',
    order: 3,
    icon: 'tree',
    emoji: '🌳',
    title: 'Dominar el diapasón',
    objective: 'Aprender que una misma nota puede aparecer en varias posiciones y dominar todo el mástil.',
    outcome: 'Conoces el diapasón completo y puedes decidir en qué posición tocar una misma nota.',
    availability: 'coming_soon',
    blocks: [
      { id: 'rb-s3-pos2', title: 'Segunda posición' },
      { id: 'rb-s3-pos3', title: 'Tercera posición' },
      { id: 'rb-s3-pos5', title: 'Quinta posición' },
      { id: 'rb-s3-pos7', title: 'Séptima posición' },
      { id: 'rb-s3-pos9', title: 'Novena posición' },
      { id: 'rb-s3-pos12', title: 'Duodécima posición' },
      { id: 'rb-s3-multi', title: 'Una nota, varias posiciones' },
      { id: 'rb-s3-lh', title: 'Digitación mano izquierda' },
      { id: 'rb-s3-rh', title: 'Digitación mano derecha' },
      { id: 'rb-s3-arp', title: 'Arpegios' },
      { id: 'rb-s3-melody', title: 'Melodía + bajo' },
      { id: 'rb-s3-poly', title: 'Polifonía' },
      { id: 'rb-s3-shift', title: 'Cambios de posición' },
    ],
  },
  {
    id: 'stage-4',
    order: 4,
    icon: 'mastery',
    emoji: '🏆',
    title: 'Maestría',
    objective: 'Automatizar todo lo aprendido y desarrollar la lectura musical a nivel avanzado.',
    outcome: 'Dominas el instrumento desde el punto de vista de la lectura y la localización de notas.',
    availability: 'coming_soon',
    blocks: [
      { id: 'rb-s4-studies', title: 'Estudios generados dinámicamente' },
      { id: 'rb-s4-map', title: 'Mapa completo del diapasón' },
      { id: 'rb-s4-cons', title: 'Modo Conservatorio' },
    ],
  },
  {
    id: 'stage-5',
    order: 5,
    icon: 'virtuoso',
    emoji: '👑',
    title: 'Virtuoso',
    objective: 'Especialízate en lo que quieres dominar: lectura extrema, velocidad, técnica clásica y más.',
    outcome: 'Entrenamiento avanzado personalizado según tus puntos débiles.',
    availability: 'post_mvp',
    blocks: [
      { id: 'rb-s5-sight', title: 'Lectura extrema' },
      { id: 'rb-s5-fret', title: 'Dominio del diapasón' },
      { id: 'rb-s5-speed', title: 'Velocidad' },
      { id: 'rb-s5-rhythm', title: 'Ritmo' },
      { id: 'rb-s5-tech', title: 'Técnica clásica' },
      { id: 'rb-s5-etudes', title: 'Estudios de métodos clásicos' },
      { id: 'rb-s5-ear', title: 'Entrenamiento auditivo' },
      { id: 'rb-s5-daily', title: 'Desafíos diarios' },
    ],
  },
];

export function getRoadmapStage(stageId: string): RoadmapStage | undefined {
  return CURRICULUM_ROADMAP.find((s) => s.id === stageId);
}
