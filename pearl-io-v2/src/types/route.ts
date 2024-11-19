export type ImageReturnType = 'screenshot' | 'static' | 'generated'

export interface Route {
  id: string
  projectId: string
  path: string
  returnType: ImageReturnType
  cacheDuration: number
  createdAt: string
  staticImagePath?: string
}

export interface RouteConfig {
  returnType: ImageReturnType
  cacheDuration: number
  staticImagePath?: string
}

export interface CreateRouteData {
  path: string
  returnType: ImageReturnType
  cacheDuration: number
  staticImagePath?: string
} 