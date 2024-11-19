import { prisma } from '@/lib/db/prisma'
import { Route } from '@prisma/client'

export async function getRouteConfig(url: string) {
  try {
    // Нормализация URL
    const urlObject = new URL(url)
    const pathname = urlObject.pathname
    const normalizedPathname = pathname.endsWith('/') ? pathname : `${pathname}/`
    const normalizedUrl = `${urlObject.origin}${normalizedPathname}`

    const routes = await prisma.route.findMany({
      include: {
        project: true,
      },
    })

    for (const route of routes) {
      const pattern = new RegExp(route.path)
      // Проверяем соответствие с нормализованным URL
      if (pattern.test(normalizedUrl)) {
        return {
          projectId: route.projectId,
          routeId: route.id,
          returnType: route.returnType,
          // staticImagePath: route.staticImagePath,
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