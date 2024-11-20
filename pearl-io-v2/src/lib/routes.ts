import { prisma } from '@/lib/db/prisma'
import { normalizeUrl } from './utils/url'

export async function getRouteConfig(url: string) {
  try {
    const normalizedUrl = normalizeUrl(url)
    
    const routes = await prisma.route.findMany({
      include: {
        project: true,
      },
    })

    for (const route of routes) {
      const pattern = new RegExp(route.path)
      if (pattern.test(normalizedUrl)) {
        return {
          projectId: route.projectId,
          routeId: route.id,
          returnType: route.returnType,
          cacheDuration: route.cacheDuration,
        }
      }
    }

    return null
  } catch (error) {
    console.error('Error in getRouteConfig:', error)
    return null
  }
} 