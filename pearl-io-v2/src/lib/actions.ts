'use server'

import { prisma } from '@/lib/db/prisma'
import { Route } from '@prisma/client'
import { cacheImage } from './cache'

export async function getProjectDetails(projectId: string) {
  const project = await prisma.project.findUnique({
    where: {
      id: projectId
    },
    include: {
      _count: {
        select: {
          cachedImages: true
        }
      },
      cachedImages: {
        orderBy: {
          createdAt: 'desc'
        }
      }
    }
  })

  if (!project) return null

  return {
    project: {
      ...project,
      generatedImages: project._count.cachedImages,
      imageLimit: 1000,
    },
    images: project.cachedImages.map(image => ({
      id: image.id,
      url: image.url,
      createdAt: image.createdAt.toISOString(),
      imageUrl: image.storagePath
    }))
  }
}

export async function getProjectAnalytics(projectId: string) {
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const requests = await prisma.imageRequest.findMany({
    where: {
      projectId,
      requestedAt: {
        gte: startOfMonth
      }
    },
    include: {
      route: true
    }
  })

  const urlCounts = requests.reduce((acc, req) => {
    acc[req.url] = (acc[req.url] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const mostSharedEntry = Object.entries(urlCounts)
    .sort(([, a], [, b]) => b - a)[0]

  const routes = await prisma.route.findMany({
    where: {
      projectId
    },
    include: {
      _count: {
        select: {
          ImageRequest: {
            where: {
              requestedAt: {
                gte: startOfMonth
              }
            }
          }
        }
      }
    }
  })

  return {
    mostSharedUrl: mostSharedEntry ? mostSharedEntry[0] : '',
    mostSharedCount: mostSharedEntry ? mostSharedEntry[1] : 0,
    routeStats: routes.map(route => ({
      route: route.path,
      count: route._count.ImageRequest
    })),
    totalRequests: requests.length,
    periodStart: startOfMonth.toISOString(),
    periodEnd: new Date().toISOString()
  }
}

export async function getProjectRoutes(projectId: string): Promise<Route[]> {
  return prisma.route.findMany({
    where: {
      projectId
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
}

export async function deleteCachedImage(imageId: string) {
  try {
    const cachedImage = await prisma.cachedImage.findUnique({
      where: { id: imageId }
    })

    if (!cachedImage) {
      return { success: false, error: 'Cached image not found' }
    }

    // Удаляем запись из БД
    await prisma.cachedImage.delete({
      where: { id: imageId }
    })

    return { success: true }
  } catch (error) {
    console.error('Error deleting cached image:', error)
    return { success: false, error: 'Failed to delete cached image' }
  }
} 