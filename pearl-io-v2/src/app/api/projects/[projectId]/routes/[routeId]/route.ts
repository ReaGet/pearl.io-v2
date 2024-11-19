import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

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
      data: {
        path: data.path,
        returnType: data.returnType,
        cacheDuration: data.cacheDuration
      }
    })

    return NextResponse.json(route)
  } catch (error) {
    console.error('Error updating route:', error)
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