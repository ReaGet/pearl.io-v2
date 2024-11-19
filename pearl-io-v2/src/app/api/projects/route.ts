import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { parseMetadata } from '@/lib/metadata'

export async function GET() {
  try {
    const projects = await prisma.project.findMany()
    return NextResponse.json(projects)
  } catch (error) {
    console.error('Error fetching projects:', error)
    return new NextResponse('Database error', { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { url, cacheDuration } = await request.json()

    // Получаем метаданные сайта
    const metadata = await parseMetadata(url)

    const project = await prisma.project.create({
      data: {
        title: metadata.title || url,
        url,
        favicon: metadata.image,
        cacheDuration
      }
    })

    return NextResponse.json(project)
  } catch (error) {
    console.error('Error creating project:', error)
    return new NextResponse('Database error', { status: 500 })
  }
} 