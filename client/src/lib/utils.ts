import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { logger } from "./logger";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Obtiene un valor del localStorage de forma segura
 * @param key - Clave del localStorage
 * @returns El valor parseado o null si hay error
 */
const getLocalStorage = <T = unknown>(key: string): T | null => {
  try {
    const item = window.localStorage.getItem(key);
    if (item === null) {
      return null;
    }
    return JSON.parse(item) as T;
  } catch (error) {
    logger.errorWithContext(`Error al leer localStorage key: ${key}`, error);
    // Intentar limpiar el valor corrupto
    try {
      window.localStorage.removeItem(key);
    } catch (cleanupError) {
      logger.errorWithContext(`Error al limpiar localStorage key: ${key}`, cleanupError);
    }
    return null;
  }
};

/**
 * Guarda un valor en el localStorage de forma segura
 * @param key - Clave del localStorage
 * @param value - Valor a guardar (será serializado a JSON)
 * @returns true si se guardó correctamente, false si hubo error
 */
const setLocalStorage = <T = unknown>(key: string, value: T): boolean => {
  try {
    const serialized = JSON.stringify(value);
    window.localStorage.setItem(key, serialized);
    return true;
  } catch (error) {
    logger.errorWithContext(`Error al escribir localStorage key: ${key}`, error, {
      valueType: typeof value,
      valueSize: JSON.stringify(value).length
    });
    
    // Si el error es por cuota excedida, intentar limpiar espacio
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      logger.warn('Cuota de localStorage excedida. Considera limpiar configuraciones antiguas.');
    }
    
    return false;
  }
};

export { getLocalStorage, setLocalStorage };
