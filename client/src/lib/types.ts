export interface BuildingType {
  id: string;
  name: string;
  color: string;
  description: string;
  category: 'housing' | 'production' | 'infrastructure' | 'culture';
  resourceCost: Record<string, number>;
  resourceProduction: Record<string, number>;
  populationCapacity: number;
  sustainabilityBonus: number;
}

export interface PlacedBuilding {
  id: string;
  buildingType: BuildingType;
  position: [number, number, number];
  rotation: [number, number, number];
  level: number;
  efficiency: number;
}

export interface HistoricalEra {
  id: string;
  name: string;
  description: string;
  category: string;
  availableBuildings: string[];
  challengeDescription: string;
  sustainabilityGoals: string[];
}

export interface SavedConfiguration {
  id: string;
  name: string;
  buildings: PlacedBuilding[];
  era: string;
  timestamp: number;
  resources: Record<string, number>;
  population: number;
  sustainabilityScore: number;
}

export const BUILDING_TYPES: BuildingType[] = [
  // Housing
  { id: 'mud-hut', name: 'Mud Hut', color: '#8B4513', description: 'Basic sustainable housing using local materials', category: 'housing', resourceCost: { wood: 2, clay: 3 }, resourceProduction: {}, populationCapacity: 4, sustainabilityBonus: 3 },
  { id: 'stone-house', name: 'Stone House', color: '#708090', description: 'Durable stone construction with good insulation', category: 'housing', resourceCost: { stone: 4, wood: 2 }, resourceProduction: {}, populationCapacity: 6, sustainabilityBonus: 2 },
  { id: 'timber-frame', name: 'Timber Frame', color: '#DEB887', description: 'Efficient wood construction with renewable materials', category: 'housing', resourceCost: { wood: 5, clay: 1 }, resourceProduction: {}, populationCapacity: 8, sustainabilityBonus: 4 },
  
  // Production
  { id: 'farm-plot', name: 'Farm Plot', color: '#228B22', description: 'Sustainable agriculture producing food', category: 'production', resourceCost: { wood: 1 }, resourceProduction: { food: 3 }, populationCapacity: 0, sustainabilityBonus: 5 },
  { id: 'lumber-mill', name: 'Lumber Mill', color: '#654321', description: 'Processes wood while managing forest resources', category: 'production', resourceCost: { stone: 3, wood: 2 }, resourceProduction: { wood: 2 }, populationCapacity: 0, sustainabilityBonus: 2 },
  { id: 'quarry', name: 'Stone Quarry', color: '#A9A9A9', description: 'Extracts stone with minimal environmental impact', category: 'production', resourceCost: { wood: 2 }, resourceProduction: { stone: 2 }, populationCapacity: 0, sustainabilityBonus: 1 },
  { id: 'pottery-kiln', name: 'Pottery Kiln', color: '#CD853F', description: 'Creates clay goods using efficient firing techniques', category: 'production', resourceCost: { stone: 2, wood: 1 }, resourceProduction: { clay: 2 }, populationCapacity: 0, sustainabilityBonus: 3 },
  
  // Infrastructure  
  { id: 'well', name: 'Community Well', color: '#4682B4', description: 'Provides clean water access for the community', category: 'infrastructure', resourceCost: { stone: 3 }, resourceProduction: { water: 4 }, populationCapacity: 0, sustainabilityBonus: 4 },
  { id: 'granary', name: 'Granary', color: '#DAA520', description: 'Stores food with pest-resistant design', category: 'infrastructure', resourceCost: { wood: 4, stone: 2 }, resourceProduction: {}, populationCapacity: 0, sustainabilityBonus: 3 },
  { id: 'windmill', name: 'Windmill', color: '#F5DEB3', description: 'Harnesses wind power for grain processing', category: 'infrastructure', resourceCost: { wood: 6, stone: 2 }, resourceProduction: { flour: 2 }, populationCapacity: 0, sustainabilityBonus: 5 },
  
  // Culture
  { id: 'temple', name: 'Sacred Temple', color: '#9370DB', description: 'Community gathering place with natural materials', category: 'culture', resourceCost: { stone: 8, wood: 4 }, resourceProduction: {}, populationCapacity: 0, sustainabilityBonus: 4 },
  { id: 'school', name: 'Learning Hall', color: '#FF6347', description: 'Education center teaching sustainable practices', category: 'culture', resourceCost: { wood: 5, stone: 3 }, resourceProduction: {}, populationCapacity: 0, sustainabilityBonus: 5 }
];

export const HISTORICAL_ERAS: HistoricalEra[] = [
  {
    id: 'neolithic',
    name: 'Neolithic Settlement',
    description: 'Build the first agricultural communities using sustainable farming and natural materials',
    category: 'prehistoric',
    availableBuildings: ['mud-hut', 'farm-plot', 'well', 'pottery-kiln'],
    challengeDescription: 'Establish a self-sufficient village with renewable resources',
    sustainabilityGoals: ['Use only renewable materials', 'Maintain soil fertility', 'Conserve water sources']
  },
  {
    id: 'bronze-age',
    name: 'Bronze Age Town',
    description: 'Develop trade networks while managing resource extraction responsibly',
    category: 'ancient',
    availableBuildings: ['stone-house', 'lumber-mill', 'quarry', 'granary', 'temple'],
    challengeDescription: 'Balance economic growth with environmental stewardship',
    sustainabilityGoals: ['Implement crop rotation', 'Prevent deforestation', 'Build lasting infrastructure']
  },
  {
    id: 'medieval',
    name: 'Medieval Village',
    description: 'Create a thriving community using traditional ecological knowledge',
    category: 'medieval',
    availableBuildings: ['timber-frame', 'windmill', 'school', 'granary', 'well'],
    challengeDescription: 'Develop renewable energy and education systems',
    sustainabilityGoals: ['Harness wind power', 'Educate about sustainability', 'Preserve local ecosystems']
  },
  {
    id: 'indigenous',
    name: 'Indigenous Community',
    description: 'Build using traditional practices that work in harmony with nature',
    category: 'traditional',
    availableBuildings: ['mud-hut', 'farm-plot', 'well', 'temple', 'school'],
    challengeDescription: 'Demonstrate time-tested sustainable living practices',
    sustainabilityGoals: ['Live within ecological limits', 'Share resources equitably', 'Preserve cultural knowledge']
  },
  {
    id: 'eco-village',
    name: 'Modern Eco-Village',
    description: 'Apply historical wisdom to create a model sustainable community',
    category: 'modern',
    availableBuildings: ['timber-frame', 'farm-plot', 'windmill', 'school', 'well', 'granary'],
    challengeDescription: 'Combine ancient knowledge with modern efficiency',
    sustainabilityGoals: ['Achieve carbon neutrality', 'Maximize biodiversity', 'Create circular economy']
  }
];
