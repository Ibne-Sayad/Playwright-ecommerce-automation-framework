type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const levels: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40
};

function currentLevel() {
  const configuredLevel = (process.env.LOG_LEVEL || 'info').toLowerCase() as LogLevel;
  return levels[configuredLevel] ?? levels.info;
}

function shouldLog(level: LogLevel) {
  return levels[level] >= currentLevel();
}

function write(level: LogLevel, message: string, meta?: unknown) {
  if (!shouldLog(level)) return;

  const prefix = `[${new Date().toISOString()}] [${level.toUpperCase()}]`;

  if (meta === undefined) {
    console.log(`${prefix} ${message}`);
    return;
  }

  console.log(`${prefix} ${message}`, meta);
}

export const logger = {
  debug: (message: string, meta?: unknown) => write('debug', message, meta),
  info: (message: string, meta?: unknown) => write('info', message, meta),
  warn: (message: string, meta?: unknown) => write('warn', message, meta),
  error: (message: string, meta?: unknown) => write('error', message, meta)
};
