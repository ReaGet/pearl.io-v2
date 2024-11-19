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