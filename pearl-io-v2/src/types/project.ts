export interface Project {
  id: string
  title: string
  url: string
  favicon?: string
  cacheDuration: number
  createdAt: string
  generatedImages?: number
  imageLimit?: number
  cachedImagesCount: number
}

export interface ProjectDetails {
  project: Project
  images: {
    id: string
    url: string
    createdAt: string
    imageUrl: string
  }[]
} 