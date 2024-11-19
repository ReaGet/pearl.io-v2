import { cleanupExpiredCache } from './cleanup'

// Запускаем очистку кэша каждый час
export function startCacheCleanup() {
  setInterval(cleanupExpiredCache, 60 * 60 * 1000)
}

// Также можно использовать cron-задачу через Vercel Cron Jobs 