export interface ImageGeneratorOptions {
  url: string
  width?: number
  height?: number
  template?: string
  metadata?: {
    title?: string
    description?: string
    image?: string
  }
}

export interface ImageResponse {
  buffer: Buffer
  metadata: {
    title: string
    description: string
    image?: string
  }
} 