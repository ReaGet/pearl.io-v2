import { cacheManager } from './index'

export async function cleanupExpiredCache() {
  try {
    const stats = await cacheManager.getStats()
    console.log('Cache cleanup started:', stats)

    const keys = await (cacheManager as any).getKeys()
    for (const key of keys) {
      const data = await (cacheManager as any).getRawValue(key)
      const item = JSON.parse(data as string)
      
      if ((cacheManager as any).isExpired(item)) {
        await (cacheManager as any).deleteKey(key)
        console.log('Removed expired cache:', key)
      }
    }

    const newStats = await cacheManager.getStats()
    console.log('Cache cleanup completed:', newStats)
  } catch (error) {
    console.error('Error during cache cleanup:', error)
  }
} 