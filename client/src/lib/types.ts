export interface DollType {
  id: string;
  name: string;
  color: string;
  description: string;
  category: 'adult' | 'child' | 'authority' | 'professional';
}

export interface PlacedDoll {
  id: string;
  dollType: DollType;
  position: [number, number, number];
  rotation: [number, number, number];
}

export interface TherapyScenario {
  id: string;
  name: string;
  description: string;
  category: string;
}

export interface SavedConfiguration {
  id: string;
  name: string;
  dolls: PlacedDoll[];
  scenario: string;
  timestamp: number;
}

export const DOLL_TYPES: DollType[] = [
  { id: 'adult-male', name: 'Adulto Masculino', color: '#4F46E5', description: 'Representación masculina adulta', category: 'adult' },
  { id: 'adult-female', name: 'Adulto Femenino', color: '#EC4899', description: 'Representación femenina adulta', category: 'adult' },
  { id: 'elderly-male', name: 'Anciano', color: '#6B7280', description: 'Representación masculina de edad avanzada', category: 'adult' },
  { id: 'elderly-female', name: 'Anciana', color: '#9CA3AF', description: 'Representación femenina de edad avanzada', category: 'adult' },
  { id: 'teen-male', name: 'Adolescente M', color: '#10B981', description: 'Representación masculina adolescente', category: 'child' },
  { id: 'teen-female', name: 'Adolescente F', color: '#34D399', description: 'Representación femenina adolescente', category: 'child' },
  { id: 'child-male', name: 'Niño', color: '#3B82F6', description: 'Representación masculina infantil', category: 'child' },
  { id: 'child-female', name: 'Niña', color: '#60A5FA', description: 'Representación femenina infantil', category: 'child' },
  { id: 'baby', name: 'Bebé', color: '#F59E0B', description: 'Representación de bebé', category: 'child' },
  { id: 'authority', name: 'Autoridad', color: '#DC2626', description: 'Figura de autoridad', category: 'authority' },
  { id: 'professional', name: 'Profesional', color: '#7C3AED', description: 'Figura profesional', category: 'professional' },
  { id: 'caregiver', name: 'Cuidador', color: '#059669', description: 'Figura de cuidado', category: 'professional' }
];

export const THERAPY_SCENARIOS: TherapyScenario[] = [
  {
    id: 'family-dynamics',
    name: 'Dinámicas Familiares',
    description: 'Exploración de las relaciones y dinámicas dentro del sistema familiar',
    category: 'family'
  },
  {
    id: 'couple-relations',
    name: 'Relaciones de Pareja',
    description: 'Análisis de la dinámica de pareja y patrones relacionales',
    category: 'couple'
  },
  {
    id: 'intrapsychic-structure',
    name: 'Estructura Intrapsíquica',
    description: 'Representación de las diferentes partes internas del individuo',
    category: 'individual'
  },
  {
    id: 'transgenerational-systemic',
    name: 'Sistémico Transgeneracional',
    description: 'Exploración de patrones transmitidos a través de las generaciones',
    category: 'systemic'
  },
  {
    id: 'work-dynamics',
    name: 'Dinámicas Laborales',
    description: 'Análisis de las relaciones y conflictos en el ámbito laboral',
    category: 'work'
  }
];
