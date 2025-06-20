import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { PlacedDoll, SavedConfiguration, LifePath, LIFE_PATHS, DollType, DOLL_TYPES } from "../types";
import { getLocalStorage, setLocalStorage } from "../utils";

interface TherapyState {
  // Scene state
  placedDolls: PlacedDoll[];
  selectedLifePath: LifePath | null;
  draggedDoll: PlacedDoll | null;
  isDragging: boolean;
  
  // UI state
  isInfoPanelOpen: boolean;
  savedConfigurations: SavedConfiguration[];
  selectedDollId: string | null;
  isFullscreen: boolean;
  
  // Actions
  addDoll: (doll: PlacedDoll) => void;
  removeDoll: (dollId: string) => void;
  updateDollPosition: (dollId: string, position: [number, number, number]) => void;
  updateDollRotation: (dollId: string, rotation: [number, number, number]) => void;
  setDraggedDoll: (doll: PlacedDoll | null) => void;
  setIsDragging: (isDragging: boolean) => void;
  clearTable: () => void;
  setSelectedLifePath: (lifePath: LifePath | null) => void;
  setSelectedDollId: (dollId: string | null) => void;
  toggleInfoPanel: () => void;
  toggleFullscreen: () => void;
  dropDoll: (dollId: string, position: [number, number, number]) => void;
  saveConfiguration: (name: string) => void;
  loadConfiguration: (configId: string) => void;
  deleteConfiguration: (configId: string) => void;
  initializeFromStorage: () => void;
  updateDollLabel: (dollId: string, label: string) => void;
  
  // Computed
  dollCount: () => number;
  getAnalysis: () => string;
  getLifePathForPosition: (position: [number, number, number]) => 'north' | 'south' | 'east' | 'west' | null;
}

export const useTherapy = create<TherapyState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    placedDolls: [],
    selectedLifePath: null,
    draggedDoll: null,
    isDragging: false,
    isInfoPanelOpen: true,
    savedConfigurations: [],
    selectedDollId: null,
    isFullscreen: false,
    
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

    updateDollRotation: (dollId: string, rotation: [number, number, number]) => {
      set((state) => ({
        placedDolls: state.placedDolls.map(doll => 
          doll.id === dollId ? { ...doll, rotation } : doll
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
    
    setSelectedLifePath: (lifePath: LifePath | null) => {
      set({ selectedLifePath: lifePath });
    },

    setSelectedDollId: (dollId: string | null) => {
      set({ selectedDollId: dollId });
    },
    
    toggleInfoPanel: () => {
      set((state) => ({
        isInfoPanelOpen: !state.isInfoPanelOpen
      }));
    },

    toggleFullscreen: () => {
      set((state) => ({
        isFullscreen: !state.isFullscreen
      }));
    },

    dropDoll: (dollId: string, position: [number, number, number]) => {
      const lifePath = get().getLifePathForPosition(position);
      set((state) => ({
        placedDolls: state.placedDolls.map(doll => 
          doll.id === dollId ? { 
            ...doll, 
            position, 
            lifePath,
            isDropped: true 
          } : doll
        )
      }));
    },
    
    saveConfiguration: (name: string) => {
      const { placedDolls, savedConfigurations } = get();
      const newConfig: SavedConfiguration = {
        id: `config-${Date.now()}`,
        name,
        dolls: placedDolls,
        scenario: 'four-life-paths',
        timestamp: Date.now(),
        analysis: get().getAnalysis()
      };
      
      const updatedConfigs = [...savedConfigurations, newConfig];
      set({ savedConfigurations: updatedConfigs });
      setLocalStorage('therapy-configurations', updatedConfigs);
    },
    
    loadConfiguration: (configId: string) => {
      const { savedConfigurations } = get();
      const config = savedConfigurations.find(c => c.id === configId);
      if (config) {
        set({
          placedDolls: config.dolls
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
    
    updateDollLabel: (dollId: string, label: string) => {
      set((state) => ({
        placedDolls: state.placedDolls.map(doll =>
          doll.id === dollId ? { ...doll, label } : doll
        )
      }));
    },
    
    // Computed functions
    dollCount: () => {
      return get().placedDolls.length;
    },
    
    getAnalysis: () => {
      const { placedDolls } = get();
      const pathCounts = {
        north: placedDolls.filter(d => d.lifePath === 'north').length,
        south: placedDolls.filter(d => d.lifePath === 'south').length,
        east: placedDolls.filter(d => d.lifePath === 'east').length,
        west: placedDolls.filter(d => d.lifePath === 'west').length
      };
      
      const totalDropped = placedDolls.filter(d => d.isDropped).length;
      
      if (totalDropped === 0) return "Mesa vacía - listo para comenzar la sesión";
      
      const dominantPath = Object.entries(pathCounts).reduce((a, b) => 
        pathCounts[a[0] as keyof typeof pathCounts] > pathCounts[b[0] as keyof typeof pathCounts] ? a : b
      )[0];
      
      const pathNames = {
        north: 'Migrante (búsqueda)',
        south: 'Sufrimiento (lucha)',
        east: 'Placer (disfrute)',
        west: 'Deber (responsabilidad)'
      };
      
      return `${totalDropped} muñecos colocados. Patrón dominante: ${pathNames[dominantPath as keyof typeof pathNames]}`;
    },

    getLifePathForPosition: (position: [number, number, number]) => {
      const [x, , z] = position;
      
      // Determine path based on position on circular table
      if (Math.abs(x) < 1 && Math.abs(z) < 1) return null; // Center
      
      const angle = Math.atan2(z, x);
      const normalizedAngle = (angle + Math.PI * 2) % (Math.PI * 2);
      
      // Divide into 4 quadrants
      if (normalizedAngle >= 0 && normalizedAngle < Math.PI / 2) return 'east';
      if (normalizedAngle >= Math.PI / 2 && normalizedAngle < Math.PI) return 'north';
      if (normalizedAngle >= Math.PI && normalizedAngle < 3 * Math.PI / 2) return 'west';
      return 'south';
    }
  }))
);

// Initialize from storage on app start
useTherapy.getState().initializeFromStorage();