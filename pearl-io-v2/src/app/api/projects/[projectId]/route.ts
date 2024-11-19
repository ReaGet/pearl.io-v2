import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const project = await prisma.project.findUnique({
      where: {
        id: params.projectId
      },
      include: {
        routes: true,
        cachedImages: {
          orderBy: {
            createdAt: 'desc'
          }
        },
        _count: {
          select: {
            cachedImages: true
          }
        }
      }
    })

    if (!project) {
      return new NextResponse('Project not found', { status: 404 })
    }

    // Форматируем данные для фронтенда
    const response = {
      project: {
        ...project,
        generatedImages: project._count.cachedImages,
        imageLimit: 1000, // Можно вынести в конфиг или ENV
      },
      images: project.cachedImages.map(image => ({
        id: image.id,
        url: image.url,
        createdAt: image.createdAt,
        imageUrl: image.storagePath
      }))
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching project details:', error)
    return new NextResponse('Database error', { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    await prisma.project.delete({
      where: {
        id: params.projectId
      }
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Error deleting project:', error)
    return new NextResponse('Database error', { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const data = await request.json()

    const project = await prisma.project.update({
      where: {
        id: params.projectId
      },
      data
    })

    return NextResponse.json(project)
  } catch (error) {
    console.error('Error updating project:', error)
    return new NextResponse('Database error', { status: 500 })
  }
} 