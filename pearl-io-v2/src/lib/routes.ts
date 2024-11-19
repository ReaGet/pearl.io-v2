import { prisma } from '@/lib/db/prisma'
import { Route } from '@prisma/client'

export async function getRouteConfig(url: string) {
  try {
    // Находим проект по URL
    const project = await prisma.project.findFirst({
      where: {
        url: new URL(url).origin
      }
    })

    if (!project) return null

    // Находим все маршруты проекта
    const routes = await prisma.route.findMany({
      where: {
        projectId: project.id
      }
    })

    // Находим подходящий маршрут
    const pathname = new URL(url).pathname
    const matchingRoute = routes.find((route: Route) => {
      const routePattern = new RegExp(
        '^' + route.path.replace(/:[^\s/]+/g, '([^/]+)') + '$'
      )
      return routePattern.test(pathname)
    })

    if (!matchingRoute) return null

    return {
      projectId: project.id,
      routeId: matchingRoute.id,
      returnType: matchingRoute.returnType,
      cacheDuration: matchingRoute.cacheDuration,
      staticImagePath: matchingRoute.returnType === 'static' ? 
        `/static/${project.id}/${matchingRoute.id}.jpg` : undefined
    }
  } catch (error) {
    console.error('Error getting route config:', error)
    return null
  }
} 