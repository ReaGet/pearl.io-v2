import puppeteer from 'puppeteer'
import { ImageGeneratorOptions } from '@/types/image'

export async function generateScreenshot({ url, width = 1200, height = 630 }: ImageGeneratorOptions) {
  const browser = await puppeteer.launch({
    headless: true,
  })

  try {
    const page = await browser.newPage()
    await page.setViewport({ width, height })
    await page.goto(url, { waitUntil: 'networkidle0' })
    
    const screenshot = await page.screenshot({
      type: 'jpeg',
      quality: 90,
    })

    return Buffer.from(screenshot)
  } finally {
    await browser.close()
  }
} 