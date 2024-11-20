import { NextRequest, NextResponse } from 'next/server'
import { generateScreenshot } from '@/lib/imageGenerators/screenshot'
import { getRouteConfig } from '@/lib/routes'
import { cacheManager } from '@/lib/cache/index'
import { prisma } from '@/lib/db/prisma'
import { normalizeUrl } from '@/lib/utils/url'

export async function GET(request: NextRequest) {
  try {
    const url = request.nextUrl.searchParams.get('url')
    if (!url) {
      return new NextResponse('URL parameter is required', { status: 400 })
    }

    const normalizedUrl = normalizeUrl(url)
    const routeConfig = await getRouteConfig(normalizedUrl)
    
    if (!routeConfig) {
      return new NextResponse('Route not configured', { status: 404 })
    }

    // Track the request
    await prisma.imageRequest.create({
      data: {
        url: normalizedUrl,
        projectId: routeConfig.projectId,
        routeId: routeConfig.routeId,
      }
    })

    const cachedImageRecord = await prisma.cachedImage.findFirst({
      where: {
        url: normalizedUrl,
        expiresAt: {
          gt: new Date()
        }
      }
    })

    if (cachedImageRecord) {
      try {
        const cachedImage = await cacheManager.get(normalizedUrl)
        if (cachedImage && cachedImage.buffer) {
          const buffer = Buffer.from(cachedImage.buffer, 'base64')
          return new NextResponse(buffer, {
            headers: {
              'Content-Type': 'image/jpeg',
              'Cache-Control': 'public, max-age=31536000',
            },
          })
        }
      } catch (cacheError) {
        console.error('Error retrieving from cache:', cacheError)
      }
    }

    let imageBuffer: Buffer | undefined;
    try {
      switch (routeConfig.returnType) {
        case 'screenshot':
          try {
            imageBuffer = await generateScreenshot({ url: normalizedUrl })
            if (!imageBuffer || !(imageBuffer instanceof Buffer)) {
              console.error('Invalid screenshot result:', imageBuffer)
              throw new Error('Invalid screenshot format')
            }
          } catch (screenshotError) {
            console.error('Screenshot generation failed:', screenshotError)
            throw new Error('Failed to generate screenshot')
          }
          break
        case 'static':
          // if (!routeConfig.staticImagePath) {
          //   return new NextResponse('Static image path is required', { status: 400 })
          // }
          // try {
          //   imageBuffer = await readFile(routeConfig.staticImagePath)
          // } catch (fileError) {
          //   console.error('Static file read failed:', fileError)
          //   throw new Error('Failed to read static image')
          // }
          break
        default:
          return new NextResponse('Invalid return type', { status: 400 })
      }

      if (!imageBuffer) {
        return new NextResponse('No image generated', { status: 500 })
      }
    } catch (generationError) {
      console.error('Error generating image:', generationError)
      return new NextResponse('Error generating image', { status: 500 })
    }

    try {
      await cacheManager.set(normalizedUrl, imageBuffer, {
        cacheDuration: routeConfig.cacheDuration,
      })

      const expiresAt = new Date(Date.now() + routeConfig.cacheDuration * 1000)
      
      await prisma.cachedImage.upsert({
        where: {
          url_projectId_routeId: {
            url: normalizedUrl,
            projectId: routeConfig.projectId,
            routeId: routeConfig.routeId,
          }
        },
        update: {
          expiresAt,
        },
        create: {
          url: normalizedUrl,
          projectId: routeConfig.projectId,
          routeId: routeConfig.routeId,
          storagePath: `${routeConfig.projectId}/${routeConfig.routeId}/${Date.now()}.jpg`,
          expiresAt,
        }
      })
    } catch (saveError) {
      console.error('Error saving to cache:', saveError)
    }

    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000',
      },
    })
  } catch (error) {
    console.error('Error in OG image generation:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 