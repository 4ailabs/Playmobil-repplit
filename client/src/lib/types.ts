export interface DollType {
  id: string;
  name: string;
  color: string;
  description: string;
  category: 'self' | 'father' | 'mother' | 'grandfather' | 'grandmother' | 'partner' | 'child' | 'sibling' | 'other';
}

export interface PlacedDoll {
  id: string;
  dollType: DollType;
  position: [number, number, number];
  rotation: [number, number, number];
  lifePath: 'north' | 'south' | 'east' | 'west' | null;
  isDropped: boolean;
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
  { id: 'self', name: 'Yo/Myself', color: '#4F46E5', description: 'Representa a la persona en terapia', category: 'self' },
  { id: 'father', name: 'Padre', color: '#1E40AF', description: 'Figura paterna', category: 'father' },
  { id: 'mother', name: 'Madre', color: '#EC4899', description: 'Figura materna', category: 'mother' },
  { id: 'grandfather-p', name: 'Abuelo Paterno', color: '#6B7280', description: 'Abuelo de línea paterna', category: 'grandfather' },
  { id: 'grandmother-p', name: 'Abuela Paterna', color: '#9CA3AF', description: 'Abuela de línea paterna', category: 'grandmother' },
  { id: 'grandfather-m', name: 'Abuelo Materno', color: '#374151', description: 'Abuelo de línea materna', category: 'grandfather' },
  { id: 'grandmother-m', name: 'Abuela Materna', color: '#6B7280', description: 'Abuela de línea materna', category: 'grandmother' },
  { id: 'partner', name: 'Pareja', color: '#DC2626', description: 'Pareja actual o significativa', category: 'partner' },
  { id: 'child-1', name: 'Hijo/a Mayor', color: '#10B981', description: 'Primer hijo/a', category: 'child' },
  { id: 'child-2', name: 'Hijo/a 2', color: '#34D399', description: 'Segundo hijo/a', category: 'child' },
  { id: 'sibling-1', name: 'Hermano/a Mayor', color: '#3B82F6', description: 'Hermano/a mayor', category: 'sibling' },
  { id: 'sibling-2', name: 'Hermano/a Menor', color: '#60A5FA', description: 'Hermano/a menor', category: 'sibling' },
  { id: 'other-1', name: 'Otro Familiar', color: '#F59E0B', description: 'Otra figura significativa', category: 'other' },
  { id: 'other-2', name: 'Figura Importante', color: '#7C3AED', description: 'Otra persona importante', category: 'other' }
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
