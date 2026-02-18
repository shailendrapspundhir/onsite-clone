// Configurable logger for standalone portal - reads LOG_LEVEL from .env
// Levels: DEBUG (all), INFO, WARN, ERROR. Default: INFO
// Enables debugging profile errors, API fails, etc.

type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

const LOG_LEVEL = (process.env.NEXT_PUBLIC_LOG_LEVEL || process.env.LOG_LEVEL || 'INFO').toUpperCase() as LogLevel;

const LEVELS: Record<LogLevel, number> = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
};

const currentLevel = LEVELS[LOG_LEVEL] ?? LEVELS.INFO;

function shouldLog(level: LogLevel): boolean {
  return LEVELS[level] >= currentLevel;
}

export const logger = {
  debug: (message: string, meta?: any) => {
    if (shouldLog('DEBUG')) {
      console.debug(`[DEBUG] ${message}`, meta ? meta : '');
    }
  },
  info: (message: string, meta?: any) => {
    if (shouldLog('INFO')) {
      console.info(`[INFO] ${message}`, meta ? meta : '');
    }
  },
  warn: (message: string, meta?: any) => {
    if (shouldLog('WARN')) {
      console.warn(`[WARN] ${message}`, meta ? meta : '');
    }
  },
  error: (message: string, meta?: any) => {
    if (shouldLog('ERROR')) {
      console.error(`[ERROR] ${message}`, meta ? meta : '');
    }
  },
};

// Set in .env: LOG_LEVEL=DEBUG for verbose (e.g., to debug profile updates, API calls)
