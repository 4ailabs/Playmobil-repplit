import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { PlacedBuilding, SavedConfiguration, HistoricalEra, HISTORICAL_ERAS, BuildingType, BUILDING_TYPES } from "../types";
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
    addDoll: (doll: PlacedDoll) => {
      set((state) => ({
        placedDolls: [...state.placedDolls, doll]
      }));
    },
    
    removeDoll: (dollId: string) => {
      set((state) => ({
        placedDolls: state.placedDolls.filter(doll => doll.id !== dollId)
      }));
    },
    
    updateDollPosition: (dollId: string, position: [number, number, number]) => {
      set((state) => ({
        placedDolls: state.placedDolls.map(doll => 
          doll.id === dollId ? { ...doll, position } : doll
        )
      }));
    },
    
    setDraggedDoll: (doll: PlacedDoll | null) => {
      set({ draggedDoll: doll });
    },
    
    setIsDragging: (isDragging: boolean) => {
      set({ isDragging });
    },
    
    clearTable: () => {
      set({ placedDolls: [] });
    },
    
    setSelectedScenario: (scenario: TherapyScenario) => {
      set({ selectedScenario: scenario });
      // Clear table when changing scenarios
      get().clearTable();
    },
    
    toggleInfoPanel: () => {
      set((state) => ({
        isInfoPanelOpen: !state.isInfoPanelOpen
      }));
    },
    
    saveConfiguration: (name: string) => {
      const { placedDolls, selectedScenario, savedConfigurations } = get();
      const newConfig: SavedConfiguration = {
        id: `config-${Date.now()}`,
        name,
        dolls: placedDolls,
        scenario: selectedScenario.id,
        timestamp: Date.now()
      };
      
      const updatedConfigs = [...savedConfigurations, newConfig];
      set({ savedConfigurations: updatedConfigs });
      setLocalStorage('therapy-configurations', updatedConfigs);
    },
    
    loadConfiguration: (configId: string) => {
      const { savedConfigurations } = get();
      const config = savedConfigurations.find(c => c.id === configId);
      if (config) {
        const scenario = THERAPY_SCENARIOS.find(s => s.id === config.scenario) || THERAPY_SCENARIOS[0];
        set({
          placedDolls: config.dolls,
          selectedScenario: scenario
        });
      }
    },
    
    deleteConfiguration: (configId: string) => {
      const { savedConfigurations } = get();
      const updatedConfigs = savedConfigurations.filter(c => c.id !== configId);
      set({ savedConfigurations: updatedConfigs });
      setLocalStorage('therapy-configurations', updatedConfigs);
    },
    
    initializeFromStorage: () => {
      const savedConfigs = getLocalStorage('therapy-configurations') || [];
      set({ savedConfigurations: savedConfigs });
    },
    
    // Computed functions
    dollCount: () => {
      return get().placedDolls.length;
    },
    
    getAnalysis: () => {
      const count = get().dollCount();
      if (count === 0) return "Mesa vacía - listo para comenzar";
      if (count === 1) return "Configuración individual - exploración personal";
      if (count === 2) return "Relación dual - dinámicas de pareja";
      if (count <= 4) return "Grupo pequeño - dinámicas familiares básicas";
      return "Sistema complejo - múltiples relaciones e interacciones";
    }
  }))
);

// Initialize from storage on app start
useTherapy.getState().initializeFromStorage();
