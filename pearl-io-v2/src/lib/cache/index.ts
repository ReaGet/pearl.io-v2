import { createClient } from '@vercel/kv'
import { CacheConfig, CachedImage, CacheStats, CacheManager } from './types'

class CacheManagerImpl implements CacheManager {
  private kv: ReturnType<typeof createClient>

  constructor() {
    this.kv = createClient({
      url: process.env.KV_REST_API_URL!,
      token: process.env.KV_REST_API_TOKEN!,
    })
  }

  private getKey(url: string): string {
    return `og:${url}`
  }

  async get(url: string): Promise<CachedImage | null> {
    try {
      const cached = await this.kv.get(this.getKey(url))
      return cached ? JSON.parse(cached as string) : null
    } catch (error) {
      console.error('Error getting cached image:', error)
      return null
    }
  }

  async set(url: string, buffer: Buffer, config: CacheConfig): Promise<void> {
    try {
      const data: CachedImage = {
        buffer: buffer.toString('base64'),
        createdAt: new Date().toISOString(),
        config,
      }
      await this.kv.set(this.getKey(url), JSON.stringify(data), {
        ex: config.cacheDuration,
      })
    } catch (error) {
      console.error('Error caching image:', error)
    }
  }

  async delete(url: string): Promise<void> {
    try {
      await this.kv.del(this.getKey(url))
    } catch (error) {
      console.error('Error clearing cache:', error)
    }
  }

  async getStats(): Promise<CacheStats> {
    try {
      const keys = await this.kv.keys('og:*')
      const total = keys.length
      const items = await Promise.all(
        keys.map(async (key) => {
          const data = await this.kv.get(key)
          return JSON.parse(data as string) as CachedImage
        })
      )

      const activeItems = items.filter(item => !this.isExpired(item))
      const expiredItems = items.filter(item => this.isExpired(item))

      return {
        totalItems: total,
        activeItems: activeItems.length,
        expiredItems: expiredItems.length,
        totalSize: items.reduce((acc, item) => acc + this.getItemSize(item), 0),
      }
    } catch (error) {
      console.error('Error getting cache stats:', error)
      return {
        totalItems: 0,
        activeItems: 0,
        expiredItems: 0,
        totalSize: 0,
      }
    }
  }

  isExpired(item: CachedImage): boolean {
    const now = new Date()
    const createdAt = new Date(item.createdAt)
    const expiryDate = new Date(createdAt.getTime() + item.config.cacheDuration * 1000)
    return now > expiryDate
  }

  getItemSize(item: CachedImage): number {
    return Buffer.from(item.buffer, 'base64').length
  }

  async getKeys(): Promise<string[]> {
    return this.kv.keys('og:*')
  }

  async getRawValue(key: string): Promise<any> {
    return this.kv.get(key)
  }

  async deleteKey(key: string): Promise<void> {
    await this.kv.del(key)
  }
}

export const cacheManager = new CacheManagerImpl() 