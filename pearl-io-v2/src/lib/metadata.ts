import { load } from 'cheerio'

export async function parseMetadata(url: string) {
  const response = await fetch(url)
  const html = await response.text()
  const $ = load(html)

  return {
    title: $('title').text() || $('meta[property="og:title"]').attr('content') || '',
    description: $('meta[name="description"]').attr('content') || $('meta[property="og:description"]').attr('content') || '',
    image: $('meta[property="og:image"]').attr('content') || '',
  }
} 