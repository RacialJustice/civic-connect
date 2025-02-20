export const log = {
  info: (message: string) => console.log(`[INFO] ${message}`),
  error: (message: string, error?: unknown) => console.error(`[ERROR] ${message}`, error || ''),
  warn: (message: string) => console.warn(`[WARN] ${message}`)
};
