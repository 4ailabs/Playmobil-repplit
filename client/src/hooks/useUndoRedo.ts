import { useEffect } from 'react';
import { useTherapy } from '../lib/stores/useTherapyStore';
import { logger } from '../lib/logger';
import { toast } from 'sonner';

/**
 * Hook para manejar atajos de teclado de Undo/Redo
 * Ctrl+Z / Cmd+Z para deshacer
 * Ctrl+Y / Cmd+Shift+Z para rehacer
 */
export function useUndoRedo() {
  const { undo, redo, canUndo, canRedo } = useTherapy();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const ctrlKey = isMac ? event.metaKey : event.ctrlKey;

      // Undo: Ctrl+Z o Cmd+Z
      if (ctrlKey && event.key === 'z' && !event.shiftKey) {
        event.preventDefault();
        if (canUndo()) {
          const success = undo();
          if (success) {
            toast.success('Acción deshecha', {
              duration: 2000,
              icon: '↶'
            });
            logger.debug('Undo ejecutado por atajo de teclado');
          }
        } else {
          toast.info('No hay más acciones para deshacer', {
            duration: 2000
          });
        }
      }

      // Redo: Ctrl+Y o Cmd+Shift+Z
      if ((ctrlKey && event.key === 'y') || (ctrlKey && event.shiftKey && event.key === 'z')) {
        event.preventDefault();
        if (canRedo()) {
          const success = redo();
          if (success) {
            toast.success('Acción rehecha', {
              duration: 2000,
              icon: '↷'
            });
            logger.debug('Redo ejecutado por atajo de teclado');
          }
        } else {
          toast.info('No hay más acciones para rehacer', {
            duration: 2000
          });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [undo, redo, canUndo, canRedo]);
}

