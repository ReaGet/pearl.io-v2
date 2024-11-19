export interface RouteStats {
  route: string
  count: number
}

export interface ProjectAnalytics {
  mostSharedUrl: string
  mostSharedCount: number
  routeStats: RouteStats[]
  totalRequests: number
  periodStart: string
  periodEnd: string
} 