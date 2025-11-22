export interface DollType {
  id: string;
  name: string;
  color: string;
  description: string;
  category: 'self' | 'father' | 'mother' | 'grandfather' | 'grandmother' | 'partner' | 'child' | 'sibling' | 'deceased' | 'other';
}

export type RelationshipType = 'family' | 'conflict' | 'tension' | 'strong' | 'distant';

export interface DollRelationship {
  targetId: string;
  type: RelationshipType;
  label?: string;
}

export interface PlacedDoll {
  id: string;
  dollType: DollType;
  position: [number, number, number];
  rotation: [number, number, number];
  lifePath: 'north' | 'south' | 'east' | 'west' | null;
  isDropped: boolean;
  label?: string;
  relationships?: DollRelationship[]; // Conexiones con otros muñecos
  emotion?: 'neutral' | 'happy' | 'sad' | 'angry' | 'anxious'; // Estado emocional
  notes?: string; // Notas expandibles
}

export interface LifePath {
  id: 'north' | 'south' | 'east' | 'west';
  name: string;
  description: string;
  characteristics: string[];
  benefits: string[];
  risks: string[];
  motivations: string[];
  fears: string[];
  color: string;
}

export interface SavedConfiguration {
  id: string;
  name: string;
  dolls: PlacedDoll[];
  scenario: string;
  timestamp: number;
  analysis: string;
}

export const DOLL_TYPES: DollType[] = [
  // Children and Adolescents - Only these can be selected in therapy
  { id: 'baby-boy', name: 'Bebé (niño)', color: '#93C5FD', description: 'Bebé varón (0-2 años)', category: 'child' },
  { id: 'baby-girl', name: 'Bebé (niña)', color: '#FBBF24', description: 'Bebé niña (0-2 años)', category: 'child' },
  
  // Deceased babies - important for systemic dynamics
  { id: 'deceased-baby-boy', name: 'Bebé Fallecido (niño)', color: '#6B7280', description: 'Bebé varón fallecido (aborto/óbito)', category: 'deceased' },
  { id: 'deceased-baby-girl', name: 'Bebé Fallecido (niña)', color: '#9CA3AF', description: 'Bebé niña fallecida (aborto/óbito)', category: 'deceased' },
  { id: 'deceased-baby-unknown', name: 'Bebé Fallecido (desconocido)', color: '#D1D5DB', description: 'Bebé fallecido de sexo desconocido', category: 'deceased' },
  { id: 'child-boy', name: 'Niño', color: '#3B82F6', description: 'Niño pequeño (3-8 años)', category: 'child' },
  { id: 'child-girl', name: 'Niña', color: '#EC4899', description: 'Niña pequeña (3-8 años)', category: 'child' },
  { id: 'teen-boy', name: 'Adolescente (chico)', color: '#1E40AF', description: 'Adolescente varón (9-17 años)', category: 'child' },
  { id: 'teen-girl', name: 'Adolescente (chica)', color: '#DB2777', description: 'Adolescente mujer (9-17 años)', category: 'child' },
  
  // Adults - Parents generation
  { id: 'father', name: 'Padre', color: '#1F2937', description: 'Figura paterna', category: 'father' },
  { id: 'mother', name: 'Madre', color: '#7C2D12', description: 'Figura materna', category: 'mother' },
  { id: 'stepfather', name: 'Padrastro', color: '#374151', description: 'Padrastro o figura paterna sustituta', category: 'father' },
  { id: 'stepmother', name: 'Madrastra', color: '#92400E', description: 'Madrastra o figura materna sustituta', category: 'mother' },
  
  // Grandparents generation
  { id: 'grandfather-paternal', name: 'Abuelo Paterno', color: '#4B5563', description: 'Padre del padre', category: 'grandfather' },
  { id: 'grandmother-paternal', name: 'Abuela Paterna', color: '#6B7280', description: 'Madre del padre', category: 'grandmother' },
  { id: 'grandfather-maternal', name: 'Abuelo Materno', color: '#374151', description: 'Padre de la madre', category: 'grandfather' },
  { id: 'grandmother-maternal', name: 'Abuela Materna', color: '#9CA3AF', description: 'Madre de la madre', category: 'grandmother' },
  
  // Adult children (sons and daughters)
  { id: 'son-adult', name: 'Hijo (adulto)', color: '#059669', description: 'Hijo varón adulto', category: 'child' },
  { id: 'daughter-adult', name: 'Hija (adulta)', color: '#10B981', description: 'Hija mujer adulta', category: 'child' },
  
  // Abstract geometric shapes for concepts
  { id: 'circle-concept', name: 'Círculo', color: '#8B5CF6', description: 'Representa emociones, ciclos o conceptos abstractos', category: 'other' },
  { id: 'triangle-concept', name: 'Triángulo', color: '#F59E0B', description: 'Representa conflictos, tensiones o cambios', category: 'other' },
  { id: 'square-concept', name: 'Cuadrado', color: '#EF4444', description: 'Representa estabilidad, normas o estructuras', category: 'other' },
  { id: 'diamond-concept', name: 'Rombo', color: '#10B981', description: 'Representa valores, objetivos o aspiraciones', category: 'other' },
  { id: 'star-concept', name: 'Estrella', color: '#F97316', description: 'Representa sueños, esperanzas o guías espirituales', category: 'other' }
];

export const LIFE_PATHS: LifePath[] = [
  {
    id: 'north',
    name: 'El Camino del Migrante (Norte)',
    description: 'Representa la búsqueda de lo nuevo, la exploración y la aventura. Un trayecto marcado por la incertidumbre pero también por la esperanza.',
    characteristics: [
      'Incertidumbre y falta de referencias claras',
      'Implica riesgo y desconocimiento',
      'Refleja un deseo de cambio o escape',
      'Adaptabilidad y resiliencia requeridas'
    ],
    benefits: [
      'Oportunidades de crecimiento personal',
      'Innovación y creatividad',
      'Desarrollo de nuevas habilidades',
      'Expansión de perspectivas'
    ],
    risks: [
      'Sensación de pérdida y desorientación',
      'Ansiedad e inseguridad',
      'Aislamiento y soledad',
      'Desconexión de redes de apoyo'
    ],
    motivations: [
      'Deseo de cambio y renovación',
      'Exploración y aventura',
      'Escape de situaciones insatisfactorias',
      'Búsqueda de nuevas oportunidades'
    ],
    fears: [
      'Temor a lo desconocido',
      'Miedo al fracaso',
      'Inseguridad sobre capacidades',
      'Temor a no encontrar lo buscado'
    ],
    color: '#3B82F6'
  },
  {
    id: 'south',
    name: 'El Camino del Sufrimiento (Sur)',
    description: 'Representa un lugar de conflicto donde predomina el sufrimiento, el miedo y la reactividad. Caracterizado por la necesidad de sobrevivir.',
    characteristics: [
      'Reactividad y supervivencia constante',
      'Estado de alerta permanente',
      'Refleja situaciones de lucha y dolor',
      'Patrones de comportamiento defensivos'
    ],
    benefits: [
      'Desarrollo de resistencia',
      'Fortalecimiento del carácter',
      'Aprendizaje profundo',
      'Capacidad de superación'
    ],
    risks: [
      'Trauma y estrés crónico',
      'Patrones autodestructivos',
      'Aislamiento emocional',
      'Perpetuación del sufrimiento'
    ],
    motivations: [
      'Supervivencia y protección',
      'Escape del dolor',
      'Búsqueda de seguridad',
      'Necesidad de control'
    ],
    fears: [
      'Miedo a ser herido nuevamente',
      'Temor a la vulnerabilidad',
      'Pánico al abandono',
      'Terror a la repetición del trauma'
    ],
    color: '#DC2626'
  },
  {
    id: 'west',
    name: 'El Camino del Deber (Oeste)',
    description: 'El camino de la misión y la responsabilidad. Individuos que sienten que deben cumplir con un deber impuesto o elegido.',
    characteristics: [
      'Fuerte sensación de obligación',
      'Compromiso con responsabilidades',
      'Vida estructurada por expectativas',
      'Cumplimiento de roles heredados'
    ],
    benefits: [
      'Sentido de propósito claro',
      'Estabilidad y estructura',
      'Reconocimiento social',
      'Satisfacción del deber cumplido'
    ],
    risks: [
      'Rigidez y falta de flexibilidad',
      'Supresión de deseos personales',
      'Resentimiento y frustración',
      'Pérdida de autenticidad'
    ],
    motivations: [
      'Cumplir expectativas familiares',
      'Mantener tradiciones',
      'Buscar aprobación',
      'Servir a otros'
    ],
    fears: [
      'Miedo a decepcionar',
      'Temor al juicio',
      'Pánico al cambio',
      'Miedo a la irresponsabilidad'
    ],
    color: '#F59E0B'
  },
  {
    id: 'east',
    name: 'El Camino del Placer (Este)',
    description: 'Representa el camino del gozo y la satisfacción. Un trayecto donde las necesidades están cubiertas y prevalece el disfrute.',
    characteristics: [
      'Abundancia y comodidad',
      'Estabilidad material y emocional',
      'Disfrute de la vida',
      'Satisfacción de necesidades'
    ],
    benefits: [
      'Bienestar y felicidad',
      'Desarrollo de talentos',
      'Relaciones satisfactorias',
      'Crecimiento personal'
    ],
    risks: [
      'Complacencia y estancamiento',
      'Dependencia y falta de iniciativa',
      'Riesgo de excesos',
      'Desconexión de la realidad'
    ],
    motivations: [
      'Búsqueda de felicidad',
      'Mantener el confort',
      'Disfrutar la vida',
      'Evitar el sufrimiento'
    ],
    fears: [
      'Miedo a perder lo conseguido',
      'Temor al esfuerzo',
      'Pánico a la escasez',
      'Miedo a la responsabilidad'
    ],
    color: '#10B981'
  }
];
