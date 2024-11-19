import * as cheerio from 'cheerio';
import axios from 'axios';
import { URL } from 'url';

interface PageMetadata {
  origin: string;
  title: string;
  favicon: string;
}

async function parseWebPage(url: string): Promise<PageMetadata> {
  try {
    // Получаем HTML страницы
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);
    
    // Получаем origin из URL
    const urlObject = new URL(url);
    const origin = urlObject.origin;

    // Получаем title
    const title = $('title').text() || $('meta[property="og:title"]').attr('content') || '';

    // Получаем favicon
    let favicon = $('link[rel="icon"]').attr('href') || 
                 $('link[rel="shortcut icon"]').attr('href') || 
                 '/favicon.ico';

    // Если favicon относительный путь, делаем его абсолютным
    if (favicon && !favicon.startsWith('http')) {
      favicon = new URL(favicon, origin).href;
    }

    return {
      origin,
      title,
      favicon
    };
  } catch (error) {
    console.error('Ошибка при парсинге страницы:', error);
    throw error;
  }
}

export { parseWebPage, type PageMetadata };