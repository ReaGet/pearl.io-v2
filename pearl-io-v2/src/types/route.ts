export type ImageReturnType = 'screenshot' | 'static' | 'generated'

export interface Route {
  id: string
  projectId: string
  path: string
  returnType: ImageReturnType
  cacheDuration: number
  createdAt: string
} 