import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { PlacedDoll, SavedConfiguration, LifePath, LIFE_PATHS, DollType, DOLL_TYPES } from "../types";
import { getLocalStorage, setLocalStorage } from "../utils";

interface GameState {
  // Game state
  placedBuildings: PlacedBuilding[];
  selectedEra: HistoricalEra;
  draggedBuilding: PlacedBuilding | null;
  isDragging: boolean;
  
  // Resources and metrics
  resources: Record<string, number>;
  population: number;
  sustainabilityScore: number;
  
  // UI state
  isInfoPanelOpen: boolean;
  savedConfigurations: SavedConfiguration[];
  showHints: boolean;
  currentHint: string | null;
  
  // Actions
  addBuilding: (building: PlacedBuilding) => void;
  removeBuilding: (buildingId: string) => void;
  updateBuildingPosition: (buildingId: string, position: [number, number, number]) => void;
  setDraggedBuilding: (building: PlacedBuilding | null) => void;
  setIsDragging: (isDragging: boolean) => void;
  clearSettlement: () => void;
  setSelectedEra: (era: HistoricalEra) => void;
  toggleInfoPanel: () => void;
  toggleHints: () => void;
  updateResources: () => void;
  canAffordBuilding: (buildingType: BuildingType) => boolean;
  saveConfiguration: (name: string) => void;
  loadConfiguration: (configId: string) => void;
  deleteConfiguration: (configId: string) => void;
  initializeFromStorage: () => void;
  
  // Computed
  buildingCount: () => number;
  getAnalysis: () => string;
  getHint: () => string;
}

export const useGame = create<GameState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    placedBuildings: [],
    selectedEra: HISTORICAL_ERAS[0],
    draggedBuilding: null,
    isDragging: false,
    resources: { wood: 10, stone: 8, clay: 6, food: 5, water: 10, flour: 0 },
    population: 0,
    sustainabilityScore: 100,
    isInfoPanelOpen: true,
    savedConfigurations: [],
    showHints: true,
    currentHint: null,
    
    // Actions
    addBuilding: (building: PlacedBuilding) => {
      const { canAffordBuilding, updateResources } = get();
      if (canAffordBuilding(building.buildingType)) {
        set((state) => ({
          placedBuildings: [...state.placedBuildings, building],
          population: state.population + building.buildingType.populationCapacity,
          sustainabilityScore: state.sustainabilityScore + building.buildingType.sustainabilityBonus
        }));
        updateResources();
      }
    },
    
    removeBuilding: (buildingId: string) => {
      set((state) => {
        const building = state.placedBuildings.find(b => b.id === buildingId);
        return {
          placedBuildings: state.placedBuildings.filter(b => b.id !== buildingId),
          population: building ? state.population - building.buildingType.populationCapacity : state.population,
          sustainabilityScore: building ? state.sustainabilityScore - building.buildingType.sustainabilityBonus : state.sustainabilityScore
        };
      });
    },
    
    updateBuildingPosition: (buildingId: string, position: [number, number, number]) => {
      set((state) => ({
        placedBuildings: state.placedBuildings.map(building => 
          building.id === buildingId ? { ...building, position } : building
        )
      }));
    },
    
    setDraggedBuilding: (building: PlacedBuilding | null) => {
      set({ draggedBuilding: building });
    },
    
    setIsDragging: (isDragging: boolean) => {
      set({ isDragging });
    },
    
    clearSettlement: () => {
      set({ 
        placedBuildings: [],
        population: 0,
        sustainabilityScore: 100,
        resources: { wood: 10, stone: 8, clay: 6, food: 5, water: 10, flour: 0 }
      });
    },
    
    setSelectedEra: (era: HistoricalEra) => {
      set({ selectedEra: era });
      get().clearSettlement();
    },
    
    toggleInfoPanel: () => {
      set((state) => ({
        isInfoPanelOpen: !state.isInfoPanelOpen
      }));
    },

    toggleHints: () => {
      set((state) => ({
        showHints: !state.showHints
      }));
    },

    updateResources: () => {
      set((state) => {
        const newResources = { ...state.resources };
        
        // Deduct building costs and add production
        state.placedBuildings.forEach(building => {
          // Deduct costs (one-time when built, tracked elsewhere)
          // Add production
          Object.entries(building.buildingType.resourceProduction).forEach(([resource, amount]) => {
            newResources[resource] = (newResources[resource] || 0) + amount;
          });
        });
        
        return { resources: newResources };
      });
    },

    canAffordBuilding: (buildingType: BuildingType) => {
      const { resources } = get();
      return Object.entries(buildingType.resourceCost).every(([resource, cost]) => {
        return (resources[resource] || 0) >= cost;
      });
    },
    
    saveConfiguration: (name: string) => {
      const { placedBuildings, selectedEra, savedConfigurations, resources, population, sustainabilityScore } = get();
      const newConfig: SavedConfiguration = {
        id: `config-${Date.now()}`,
        name,
        buildings: placedBuildings,
        era: selectedEra.id,
        timestamp: Date.now(),
        resources,
        population,
        sustainabilityScore
      };
      
      const updatedConfigs = [...savedConfigurations, newConfig];
      set({ savedConfigurations: updatedConfigs });
      setLocalStorage('game-configurations', updatedConfigs);
    },
    
    loadConfiguration: (configId: string) => {
      const { savedConfigurations } = get();
      const config = savedConfigurations.find(c => c.id === configId);
      if (config) {
        const era = HISTORICAL_ERAS.find(e => e.id === config.era) || HISTORICAL_ERAS[0];
        set({
          placedBuildings: config.buildings,
          selectedEra: era,
          resources: config.resources,
          population: config.population,
          sustainabilityScore: config.sustainabilityScore
        });
      }
    },
    
    deleteConfiguration: (configId: string) => {
      const { savedConfigurations } = get();
      const updatedConfigs = savedConfigurations.filter(c => c.id !== configId);
      set({ savedConfigurations: updatedConfigs });
      setLocalStorage('game-configurations', updatedConfigs);
    },
    
    initializeFromStorage: () => {
      const savedConfigs = getLocalStorage('game-configurations') || [];
      set({ savedConfigurations: savedConfigs });
    },
    
    // Computed functions
    buildingCount: () => {
      return get().placedBuildings.length;
    },
    
    getAnalysis: () => {
      const { buildingCount, population, sustainabilityScore } = get();
      const count = buildingCount();
      if (count === 0) return "Empty settlement - ready to begin building";
      if (sustainabilityScore > 80) return `Thriving eco-community with ${population} residents`;
      if (sustainabilityScore > 60) return `Growing settlement with ${population} residents - good sustainability`;
      if (sustainabilityScore > 40) return `Developing community with ${population} residents - needs improvement`;
      return `Settlement with ${population} residents - sustainability at risk`;
    },

    getHint: () => {
      const { placedBuildings, selectedEra, resources, sustainabilityScore } = get();
      const count = placedBuildings.length;
      
      if (count === 0) {
        return "Start by placing basic housing like a Mud Hut to shelter your first residents";
      }
      
      const hasHousing = placedBuildings.some(b => b.buildingType.category === 'housing');
      const hasProduction = placedBuildings.some(b => b.buildingType.category === 'production');
      const hasInfrastructure = placedBuildings.some(b => b.buildingType.category === 'infrastructure');
      
      if (!hasHousing) {
        return "You need housing to accommodate residents. Try building a Mud Hut or Stone House";
      }
      
      if (!hasProduction && resources.food < 3) {
        return "Food is running low! Build a Farm Plot to ensure your community doesn't go hungry";
      }
      
      if (!hasInfrastructure && count > 2) {
        return "Your settlement needs infrastructure. Consider building a Well for clean water access";
      }
      
      if (sustainabilityScore < 60) {
        return "Your sustainability score is declining. Focus on buildings with high sustainability bonuses";
      }
      
      if (count >= 5) {
        return "Great progress! Try adding cultural buildings like a Temple or Learning Hall for community wellbeing";
      }
      
      return "Your settlement is developing well. Continue expanding based on your era's available buildings";
    }
  }))
);

// Initialize from storage on app start
useGame.getState().initializeFromStorage();
