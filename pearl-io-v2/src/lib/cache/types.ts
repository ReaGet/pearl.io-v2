export interface CacheConfig {
  cacheDuration: number // в секундах
  maxSize?: number // в байтах
  compression?: boolean
}

export interface CachedImage {
  buffer: string // base64 строка
  createdAt: string
  config: CacheConfig
}

export interface CacheStats {
  totalItems: number
  activeItems: number
  expiredItems: number
  totalSize: number // в байтах
}

export interface CacheManager {
  get(url: string): Promise<CachedImage | null>
  set(url: string, buffer: Buffer, config: CacheConfig): Promise<void>
  delete(url: string): Promise<void>
  getStats(): Promise<CacheStats>
} 