import { load } from 'cheerio'

export async function parseMetadata(url: string) {
  try {
    const response = await fetch(url)
    const html = await response.text()
    const $ = load(html)

    // Получаем origin без протокола
    const urlObject = new URL(url)
    const title = urlObject.host

    // Ищем favicon в разных вариантах
    let favicon = $('link[rel="icon"]').attr('href') || 
                 $('link[rel="shortcut icon"]').attr('href') ||
                 $('link[rel="apple-touch-icon"]').attr('href') ||
                 '/favicon.ico' // Дефолтный путь, если ничего не найдено

    // Если favicon - относительный путь, делаем его абсолютным
    if (favicon && !favicon.startsWith('http')) {
      favicon = favicon.startsWith('/') 
        ? `${urlObject.origin}${favicon}`
        : `${urlObject.origin}/${favicon}`
    }

    return {
      title,
      description: $('meta[name="description"]').attr('content') || 
                  $('meta[property="og:description"]').attr('content') || '',
      image: favicon
    }
  } catch (error) {
    console.error('Error parsing metadata:', error)
    return {
      title: new URL(url).host,
      description: '',
      image: '/favicon.ico'
    }
  }
} 