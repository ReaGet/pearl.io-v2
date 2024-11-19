import { NextRequest, NextResponse } from 'next/server'
import { generateScreenshot } from '@/lib/imageGenerators/screenshot'
import { getRouteConfig } from '@/lib/routes'
import { cacheManager } from '@/lib/cache/index'
import { readFile } from 'fs/promises'

export async function GET(request: NextRequest) {
  try {
    const url = request.nextUrl.searchParams.get('url')
    if (!url) {
      return new NextResponse('URL parameter is required', { status: 400 })
    }

    const routeConfig = await getRouteConfig(url)
    if (!routeConfig) {
      return new NextResponse('Route not configured', { status: 404 })
    }

    const cachedImage = await cacheManager.get(url)
    if (cachedImage && !(cacheManager as any).isExpired(cachedImage)) {
      const buffer = Buffer.from(cachedImage.buffer, 'base64')
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': 'image/jpeg',
          'Cache-Control': 'public, max-age=31536000',
        },
      })
    }

    let buffer: Buffer
    switch (routeConfig.returnType) {
      case 'screenshot':
        buffer = await generateScreenshot({ url })
        break
      case 'static':
        if (!routeConfig.staticImagePath) {
          return new NextResponse('Static image path is required', { status: 400 })
        }
        buffer = await readFile(routeConfig.staticImagePath)
        break
      default:
        return new NextResponse('Invalid return type', { status: 400 })
    }

    await cacheManager.set(url, buffer, {
      cacheDuration: routeConfig.cacheDuration,
    })

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000',
      },
    })
  } catch (error) {
    console.error('Error generating image:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 