/**
 * Sistema de logging para la aplicación
 * Solo muestra logs en desarrollo, silencioso en producción
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const isDevelopment = import.meta.env.DEV;

class Logger {
  private shouldLog(level: LogLevel): boolean {
    if (!isDevelopment) {
      // En producción, solo mostrar errores
      return level === 'error';
    }
    return true;
  }

  debug(...args: unknown[]): void {
    if (this.shouldLog('debug')) {
      console.debug('[DEBUG]', ...args);
    }
  }

  info(...args: unknown[]): void {
    if (this.shouldLog('info')) {
      console.info('[INFO]', ...args);
    }
  }

  warn(...args: unknown[]): void {
    if (this.shouldLog('warn')) {
      console.warn('[WARN]', ...args);
    }
  }

  error(...args: unknown[]): void {
    if (this.shouldLog('error')) {
      console.error('[ERROR]', ...args);
    }
  }

  /**
   * Log de errores con contexto adicional
   */
  errorWithContext(message: string, error: unknown, context?: Record<string, unknown>): void {
    if (this.shouldLog('error')) {
      console.error('[ERROR]', message, {
        error: error instanceof Error ? {
          message: error.message,
          stack: error.stack,
          name: error.name
        } : error,
        context,
        timestamp: new Date().toISOString()
      });
    }
  }
}

export const logger = new Logger();

