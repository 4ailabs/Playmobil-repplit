import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { PlacedDoll, SavedConfiguration, LifePath, LIFE_PATHS, DollType, DOLL_TYPES } from "../types";
import { getLocalStorage, setLocalStorage } from "../utils";
import { logger } from "../logger";
import { validateSavedConfigurations, validatePlacedDoll } from "../validation";

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
  
  // OH Cards state
  selectedOHCardImages: string[];
  selectedOHCardWords: string[];
  ohCardsAssigned: number; // Contador de pares asignados
  dollNeedingOHCard: string | null; // ID del muñeco que necesita seleccionar OH Card
  autoAssignOHCards: boolean; // Si se debe asignar automáticamente OH Cards al colocar muñecos
  
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
  updateDollNotes: (dollId: string, notes: string) => void;
  updateDollEmotion: (dollId: string, emotion: 'neutral' | 'happy' | 'sad' | 'angry' | 'anxious') => void;
  addDollRelationship: (dollId: string, relationship: import("../types").DollRelationship) => void;
  removeDollRelationship: (dollId: string, targetId: string) => void;
  
  // OH Cards actions
  setSelectedOHCardImages: (images: string[]) => void;
  setSelectedOHCardWords: (words: string[]) => void;
  assignOHCardPair: (dollId: string) => void;
  updateDollOHCard: (dollId: string, image: string | undefined, word: string | undefined) => void;
  resetOHCards: () => void;
  setDollNeedingOHCard: (dollId: string | null) => void;
  setAutoAssignOHCards: (enabled: boolean) => void;
  
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
    selectedOHCardImages: [],
    selectedOHCardWords: [],
    ohCardsAssigned: 0,
    dollNeedingOHCard: null,
    autoAssignOHCards: false, // Por defecto desactivado
    
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
      try {
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
        const saved = setLocalStorage('therapy-configurations', updatedConfigs);
        if (!saved) {
          logger.warn('No se pudo guardar la configuración en localStorage');
        }
      } catch (error) {
        logger.errorWithContext('Error al guardar configuración', error);
        throw error;
      }
    },
    
    loadConfiguration: (configId: string) => {
      try {
        const { savedConfigurations } = get();
        const config = savedConfigurations.find(c => c.id === configId);
        if (config) {
          // Validar cada muñeco antes de cargar
          const validatedDolls: PlacedDoll[] = [];
          for (const doll of config.dolls) {
            const validated = validatePlacedDoll(doll);
            if (validated) {
              validatedDolls.push(validated);
            } else {
              logger.warn('Muñeco inválido omitido al cargar configuración:', doll);
            }
          }
          
          set({
            placedDolls: validatedDolls
          });
          logger.debug('Configuración cargada:', configId, `(${validatedDolls.length} muñecos válidos)`);
        } else {
          logger.warn('Configuración no encontrada:', configId);
        }
      } catch (error) {
        logger.errorWithContext('Error al cargar configuración', error, { configId });
      }
    },
    
    deleteConfiguration: (configId: string) => {
      try {
        const { savedConfigurations } = get();
        const updatedConfigs = savedConfigurations.filter(c => c.id !== configId);
        set({ savedConfigurations: updatedConfigs });
        const saved = setLocalStorage('therapy-configurations', updatedConfigs);
        if (!saved) {
          logger.warn('No se pudo guardar la eliminación en localStorage');
        }
      } catch (error) {
        logger.errorWithContext('Error al eliminar configuración', error, { configId });
      }
    },
    
    initializeFromStorage: () => {
      try {
        const savedConfigs = getLocalStorage<unknown>('therapy-configurations');
        // Validar todas las configuraciones con Zod
        const validatedConfigs = validateSavedConfigurations(savedConfigs);
        set({ savedConfigurations: validatedConfigs });
        logger.debug('Configuraciones inicializadas desde localStorage:', validatedConfigs.length, 'válidas');
        
        // Cargar preferencia de auto-asignación de OH Cards
        const autoAssign = getLocalStorage<boolean>('ohcards-auto-assign');
        if (autoAssign !== null) {
          set({ autoAssignOHCards: autoAssign });
        }
      } catch (error) {
        logger.errorWithContext('Error al inicializar desde localStorage', error);
        set({ savedConfigurations: [] });
      }
    },
    
    updateDollLabel: (dollId: string, label: string) => {
      set((state) => ({
        placedDolls: state.placedDolls.map(doll =>
          doll.id === dollId ? { ...doll, label } : doll
        )
      }));
    },
    
    updateDollNotes: (dollId: string, notes: string) => {
      set((state) => ({
        placedDolls: state.placedDolls.map(doll =>
          doll.id === dollId ? { ...doll, notes } : doll
        )
      }));
    },
    
    updateDollEmotion: (dollId: string, emotion: 'neutral' | 'happy' | 'sad' | 'angry' | 'anxious') => {
      set((state) => ({
        placedDolls: state.placedDolls.map(doll =>
          doll.id === dollId ? { ...doll, emotion } : doll
        )
      }));
    },
    
    addDollRelationship: (dollId: string, relationship: import("../types").DollRelationship) => {
      set((state) => ({
        placedDolls: state.placedDolls.map(doll => {
          if (doll.id === dollId) {
            const existingRelationships = doll.relationships || [];
            // Evitar duplicados
            if (!existingRelationships.find(r => r.targetId === relationship.targetId)) {
              return { ...doll, relationships: [...existingRelationships, relationship] };
            }
          }
          return doll;
        })
      }));
    },
    
    removeDollRelationship: (dollId: string, targetId: string) => {
      set((state) => ({
        placedDolls: state.placedDolls.map(doll => {
          if (doll.id === dollId && doll.relationships) {
            return { 
              ...doll, 
              relationships: doll.relationships.filter(r => r.targetId !== targetId) 
            };
          }
          return doll;
        })
      }));
    },
    
    // OH Cards actions
    setSelectedOHCardImages: (images: string[]) => {
      set({ selectedOHCardImages: images, ohCardsAssigned: 0 });
    },
    
    setSelectedOHCardWords: (words: string[]) => {
      set({ selectedOHCardWords: words });
    },
    
    assignOHCardPair: (dollId: string) => {
      const { selectedOHCardImages, selectedOHCardWords, ohCardsAssigned } = get();
      
      // Verificar que hay imágenes y palabras disponibles
      if (selectedOHCardImages.length === 0 || selectedOHCardWords.length === 0) {
        logger.debug('No hay OH Cards seleccionadas para asignar');
        return;
      }
      
      // Asignar el siguiente par disponible
      const pairIndex = ohCardsAssigned;
      if (pairIndex < selectedOHCardImages.length && pairIndex < selectedOHCardWords.length) {
        const image = selectedOHCardImages[pairIndex];
        const word = selectedOHCardWords[pairIndex];
        
        set((state) => ({
          placedDolls: state.placedDolls.map(doll =>
            doll.id === dollId 
              ? { ...doll, ohCardImage: image, ohCardWord: word }
              : doll
          ),
          ohCardsAssigned: state.ohCardsAssigned + 1
        }));
        
        logger.debug(`OH Card asignado al muñeco ${dollId}: imagen ${pairIndex + 1}, palabra "${word}"`);
      } else {
        logger.warn('No hay más pares de OH Cards disponibles para asignar');
      }
    },
    
    updateDollOHCard: (dollId: string, image: string | undefined, word: string | undefined) => {
      set((state) => ({
        placedDolls: state.placedDolls.map(doll =>
          doll.id === dollId 
            ? { ...doll, ohCardImage: image, ohCardWord: word }
            : doll
        ),
        dollNeedingOHCard: state.dollNeedingOHCard === dollId ? null : state.dollNeedingOHCard
      }));
    },
    
    resetOHCards: () => {
      set({ 
        selectedOHCardImages: [], 
        selectedOHCardWords: [], 
        ohCardsAssigned: 0,
        dollNeedingOHCard: null,
        placedDolls: get().placedDolls.map(doll => ({
          ...doll,
          ohCardImage: undefined,
          ohCardWord: undefined
        }))
      });
    },
    
    setDollNeedingOHCard: (dollId: string | null) => {
      set({ dollNeedingOHCard: dollId });
    },
    
    setAutoAssignOHCards: (enabled: boolean) => {
      set({ autoAssignOHCards: enabled });
      // Guardar preferencia en localStorage
      try {
        setLocalStorage('ohcards-auto-assign', enabled);
      } catch (error) {
        logger.errorWithContext('Error guardando preferencia de auto-asignación', error);
      }
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