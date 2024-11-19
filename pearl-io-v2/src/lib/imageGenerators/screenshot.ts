import puppeteer from 'puppeteer'
import { ImageGeneratorOptions } from '@/types/image'

export async function generateScreenshot({ url, width = 1200, height = 630 }: ImageGeneratorOptions): Promise<Buffer> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })

  try {
    const page = await browser.newPage()
    await page.setViewport({ width, height })
    
    // Добавляем таймаут и обработку ошибок при загрузке страницы
    try {
      await page.goto(url, { 
        waitUntil: 'networkidle0',
        timeout: 30000 // 30 секунд таймаут
      })
    } catch (error) {
      console.error('Error loading page:', error)
      throw new Error(`Failed to load page: ${url}`)
    }

    // Ждем немного для полной загрузки контента
    await new Promise(resolve => setTimeout(resolve, 1000))

    await page.setViewport({
      width: 1500, // default: 800
      height: 1000, // default: 600
      deviceScaleFactor: 1, // default: 1
    })
    
    const screenshot = await page.screenshot({
      type: 'jpeg',
      quality: 90,
      encoding: 'binary'
    })

    // Проверяем и конвертируем результат в Buffer
    if (screenshot instanceof Buffer) {
      return screenshot
    } else if (screenshot instanceof Uint8Array) {
      return Buffer.from(screenshot)
    } else {
      throw new Error('Invalid screenshot format')
    }
  } catch (error) {
    console.error('Screenshot generation error:', error)
    throw error
  } finally {
    await browser.close()
  }
} 