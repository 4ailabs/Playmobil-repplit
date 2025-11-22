import { useEffect } from "react";
import { useTherapy } from "../lib/stores/useTherapyStore";
import { logger } from "../lib/logger";

/**
 * Hook global para manejar la eliminación de muñecos con teclado
 * Evita crear múltiples listeners (uno por muñeco)
 */
export function useKeyboardDelete() {
  const { selectedDollId, removeDoll, setSelectedDollId, placedDolls } = useTherapy();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Solo procesar si hay un muñeco seleccionado
      if (!selectedDollId) return;

      // Solo procesar Delete o Backspace
      if (event.key !== 'Delete' && event.key !== 'Backspace') return;

      // Verificar que el muñeco seleccionado aún existe
      const selectedDoll = placedDolls.find(d => d.id === selectedDollId);
      if (!selectedDoll) {
        logger.warn('Muñeco seleccionado ya no existe:', selectedDollId);
        setSelectedDollId(null);
        return;
      }

      // Prevenir comportamiento por defecto
      event.preventDefault();
      
      logger.debug('Eliminando muñeco seleccionado:', selectedDoll.dollType.name);
      removeDoll(selectedDollId);
      setSelectedDollId(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedDollId, removeDoll, setSelectedDollId, placedDolls]);
}

