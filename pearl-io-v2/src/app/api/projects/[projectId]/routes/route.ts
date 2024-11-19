import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { Prisma } from '@prisma/client'

export async function GET(
  request: NextRequest,
  context: { params: { projectId: string } }
) {
  const { projectId } = context.params

  try {
    const routes = await prisma.route.findMany({
      where: {
        projectId: projectId
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(routes)
  } catch (error) {
    console.error('Error fetching routes:', error)
    return new NextResponse('Database error', { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  context: { params: { projectId: string } }
) {
  const { projectId } = context.params

  try {
    const { path, returnType, cacheDuration } = await request.json()

    const existingRoute = await prisma.route.findFirst({
      where: {
        projectId,
        path
      }
    })

    if (existingRoute) {
      return new NextResponse(
        JSON.stringify({ error: 'Маршрут с таким путем уже существует' }), 
        { 
          status: 409,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
    }

    const route = await prisma.route.create({
      data: {
        projectId,
        path,
        returnType,
        cacheDuration
      }
    })

    return NextResponse.json(route)
  } catch (error) {
    console.error('Error creating route:', error)
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return new NextResponse(
          JSON.stringify({ error: 'Маршрут с таким путем уже существует' }), 
          { 
            status: 409,
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )
      }
    }
    return new NextResponse('Database error', { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: { projectId: string; routeId: string } }
) {
  const { projectId, routeId } = context.params

  try {
    await prisma.route.delete({
      where: {
        id: routeId,
        projectId: projectId
      }
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Error deleting route:', error)
    return new NextResponse('Database error', { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: { projectId: string; routeId: string } }
) {
  const { projectId, routeId } = context.params

  try {
    const data = await request.json()

    const route = await prisma.route.update({
      where: {
        id: routeId,
        projectId: projectId
      },
      data
    })

    return NextResponse.json(route)
  } catch (error) {
    console.error('Error updating route:', error)
    return new NextResponse('Database error', { status: 500 })
  }
} 