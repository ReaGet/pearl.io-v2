type RouteConfig = {
  returnType: 'screenshot' | 'static' | 'generated';
  cacheDuration: number;
  staticImagePath?: string;
};

export async function getRouteConfig(url: string): Promise<RouteConfig | null> {
  // Здесь ваша логика определения конфигурации для разных URL
  // Пример базовой реализации:
  return {
    returnType: 'screenshot',
    cacheDuration: 86400, // 24 часа в секундах
  };
} 