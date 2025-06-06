import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { PlacedDoll, SavedConfiguration, TherapyScenario, THERAPY_SCENARIOS } from "../types";
import { getLocalStorage, setLocalStorage } from "../utils";

interface TherapyState {
  // Scene state
  placedDolls: PlacedDoll[];
  selectedScenario: TherapyScenario;
  draggedDoll: PlacedDoll | null;
  isDragging: boolean;
  
  // UI state
  isInfoPanelOpen: boolean;
  savedConfigurations: SavedConfiguration[];
  
  // Actions
  addDoll: (doll: PlacedDoll) => void;
  removeDoll: (dollId: string) => void;
  updateDollPosition: (dollId: string, position: [number, number, number]) => void;
  setDraggedDoll: (doll: PlacedDoll | null) => void;
  setIsDragging: (isDragging: boolean) => void;
  clearTable: () => void;
  setSelectedScenario: (scenario: TherapyScenario) => void;
  toggleInfoPanel: () => void;
  saveConfiguration: (name: string) => void;
  loadConfiguration: (configId: string) => void;
  deleteConfiguration: (configId: string) => void;
  initializeFromStorage: () => void;
  
  // Computed
  dollCount: () => number;
  getAnalysis: () => string;
}

export const useTherapy = create<TherapyState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    placedDolls: [],
    selectedScenario: THERAPY_SCENARIOS[0],
    draggedDoll: null,
    isDragging: false,
    isInfoPanelOpen: true,
    savedConfigurations: [],
    
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
