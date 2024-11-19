import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    // Get the start of the current month
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    // Get all requests for the current month
    const requests = await prisma.imageRequest.findMany({
      where: {
        projectId: params.projectId,
        requestedAt: {
          gte: startOfMonth
        }
      },
      include: {
        route: true
      }
    })

    // Group requests by URL to find most shared
    const urlCounts = requests.reduce((acc, req) => {
      acc[req.url] = (acc[req.url] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const mostSharedEntry = Object.entries(urlCounts)
      .sort(([, a], [, b]) => b - a)[0]

    // Group by routes for statistics
    const routes = await prisma.route.findMany({
      where: {
        projectId: params.projectId
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

    const analytics = {
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

    return NextResponse.json(analytics)
  } catch (error) {
    console.error('Error fetching analytics:', error)
    // Return an empty analytics object instead of an error response
    return NextResponse.json({
      mostSharedUrl: '',
      mostSharedCount: 0,
      routeStats: [],
      totalRequests: 0,
      periodStart: new Date().toISOString(),
      periodEnd: new Date().toISOString()
    })
  }
} 