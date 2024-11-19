import { createClient } from '@vercel/kv'

const kv = createClient({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

interface CachedImage {
  buffer: Buffer
  createdAt: Date
}

export async function getCachedImage(url: string): Promise<CachedImage | null> {
  try {
    const cached = await kv.get(`og:${url}`)
    return cached ? JSON.parse(cached as string) : null
  } catch (error) {
    console.error('Error getting cached image:', error)
    return null
  }
}

export async function cacheImage(url: string, buffer: Buffer): Promise<void> {
  try {
    const data: CachedImage = {
      buffer,
      createdAt: new Date(),
    }
    await kv.set(`og:${url}`, JSON.stringify(data))
  } catch (error) {
    console.error('Error caching image:', error)
  }
}

export async function clearCache(url: string): Promise<void> {
  try {
    await kv.del(`og:${url}`)
  } catch (error) {
    console.error('Error clearing cache:', error)
  }
} 