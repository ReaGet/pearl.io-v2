# Project overview
You are building web application that allow to generate open-graph images on fly and than cache them or returns static image for giving url.

You will be using NextJs, shadcn, tailwindcss, Lucid icon

# Core functionalities
1. See all project which user works with. Each project - individual website
  1. Users can see all their projects. Each project has favicon image, title, and cached images count value
  2. Users can click add project button, which open a modal for users to paste in any website url, choose cache duration value and add
  3. After user added a new project, a new card should be added. All information should be parsed from giving url
  4. Clicking on each project, should goes to the specific project page
2. Project page, where user can see analytics for these project.
  1. Project page should have sidebar with tabs: "Overview", "Analytics", "Settings"
  2. Fetch data for current project in "Overview".
    1. In the top we want to see how many images we generated out of some limit value
    2. Display table component. Each row should have this information: url, created_at, generated image for giving url. Table should have pagination
  3. Fetch analytics data for current project in "Analytics".
    1. Display most shared url for current project
    2. Project statistics page, where user can see for which routes images where generated and also can see the most sharing route or page
  4. Ability to set rules for any route of website.
    - Choose type of returnig image: screenshot of the page; static image, which user uploaded from his device; generated image matching created template with information from the givin route
    - Caching duration with ability of clearing image with expired cache
  5. Fetch all routes in "Settings" tab.
    1. Display table component with all setup routes.
    2. Each route should have this information: route, created_at, returning image type. edit button that opens modal where we can edit settings and clear cache for giving route.
    2. Users can click add route button, which open a modal for users to setup route.
      1. User can set route relative to origin of current project's url. User can set one of the types of returing images for giving route, cache duration.
      2. If user choose static image for giving route, we should show image uploading zone. These image will return for giving route.
    3. After user added a new route, a new route should be added.
4. API route that take url and delay params
  1. API should check if there is any rules for giving url in database. Url's origin should be matched with any url origin in project from database
  2. If there is project with giving url in database, check if there is any rule for giving route in url.
  3. If no, we apply same rules as for origin of url
  4. If there is rules for giving url we apply this rules to url. We should check cached duration value if needed and if cached is expired we should remove image and regenerate it if needed  
  3. Use Puppeteer library if settings for giving route is 'make screenshot'
  4. Use Cheerio to parse page if settings for giving route is 'generate image' and use canvas to generate and return image with parsed data
8. Each user has the limit of generated images

# Doc **
## Documentation of how to use puppeteer to take screenshot
CODE EXAMPLE:
```
import puppeteer from 'puppeteer';

export async function takeScreenshot(url: string): Promise<Buffer> {
  try {
    // Запускаем браузер
    const browser = await puppeteer.launch({
      headless: true, // Используем headless режим
    });

    // Создаем новую страницу
    const page = await browser.newPage();
    
    // Устанавливаем viewport
    await page.setViewport({
      width: 1200,
      height: 630, // Стандартный размер для open-graph изображений
    });

    // Переходим по URL
    await page.goto(url, {
      waitUntil: 'networkidle0', // Ждем, пока сеть станет неактивной
      timeout: 10000, // Таймаут 10 секунд
    });

    // Делаем скриншот
    const screenshot = await page.screenshot({
      type: 'png',
      fullPage: false,
    });

    // Закрываем браузер
    await browser.close();

    return Buffer.from(screenshot);
  } catch (error) {
    console.error('Ошибка при создании скриншота:', error);
    throw error;
  }
}

// Пример использования:
// const screenshot = await takeScreenshot('https://example.com');
```
## Documentation of how to use cheerio to parse page
```
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
```

# Current file structure