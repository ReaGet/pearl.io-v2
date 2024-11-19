import { NextRequest, NextResponse } from 'next/server'
import { cacheManager } from '@/lib/cache/index'

export async function GET() {
  try {
    const stats = await cacheManager.getStats()
    return NextResponse.json(stats)
  } catch (error) {
    return new NextResponse('Error getting cache stats', { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = request.nextUrl.searchParams.get('url')
    if (!url) {
      return new NextResponse('URL parameter is required', { status: 400 })
    }

    await cacheManager.delete(url)
    return new NextResponse('Cache cleared successfully')
  } catch (error) {
    return new NextResponse('Error clearing cache', { status: 500 })
  }
} 