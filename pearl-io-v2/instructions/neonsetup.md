# Интеграция Neon PostgreSQL для Pearl-IO v2

## Обзор проекта

Pearl-IO v2 - это веб-приложение для динамической генерации OG-изображений с возможностями кэширования. Текущая реализация использует **Vercel KV** для кэширования, но требуется перенос основных данных в **Neon PostgreSQL**.

---

## Текущая структура

### Основные компоненты
Файлы, содержащие основные типы и логику:
- **`src/types/project.ts`**
  - **Строки**: 1–9

- **`src/types/route.ts`**
  - **Строки**: 1–10

### Схема базы данных

#### Таблицы

##### `projects`
```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  url VARCHAR(512) NOT NULL,
  favicon VARCHAR(512),
  cache_duration INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

##### `routes`
```sql
CREATE TABLE routes (
  id UUID PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  path VARCHAR(512) NOT NULL,
  return_type VARCHAR(50) NOT NULL,
  cache_duration INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### `cached_images`
```sql
CREATE TABLE cached_images (
  id UUID PRIMARY KEY,
  url VARCHAR(512) NOT NULL,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  route_id UUID REFERENCES routes(id) ON DELETE CASCADE,
  storage_path VARCHAR(512) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);
```

### Необходимые API эндпоинты

#### Projects
- **GET** /api/projects
POST /api/projects
- **GET** /api/projects/:id
- **DELETE** /api/projects/:id

#### Routes
- **GET** /api/projects/:projectId/routes
- **POST** /api/projects/:projectId/routes
- **PATCH** /api/projects/:projectId/routes/:routeId
- **DELETE** /api/projects/:projectId/routes/:routeId

#### Analytics
- **GET** /api/projects/:projectId/analytics Возвращает агрегированные данные из таблицы cached_images.

### Интеграция с существующим кодом
1. Кэширование
Текущая система кэширования использует Vercel KV (см. src/lib/cache/index.ts). Необходимо:
- Сохранять метаданные кэшированных изображений в PostgreSQL.
- Использовать внешнее хранилище (например, S3) для самих изображений.
Обновить CacheManager для работы с новой структурой.
2. Обработка изображений
Логика генерации изображений находится в:

- **Файл**: route.ts
  - **Строки**: 7–59
3. Implement integration with og api route to get route config from database
4. Implement integration to load project from database and also create new projects

### Рекомендации по реализации

### Документация

- [Neon PostgreSQL](https://neon.tech/docs/reference/postgresql-syntax)
- [Prisma ORM](https://www.prisma.io/docs/orm)
- [Drizzle ORM](https://orm.drizzle.team/docs/overview)

### Code example for Neon PostgreSQL
```ts
import { neon } from '@neondatabase/serverless';
async function getData() {
  const sql = neon(process.env.DATABASE_URL);
  const response = await sql`SELECT version()`;
  return response[0].version;
}
export default async function Page() {
  const data = await getData();
  return <>{data}</>;
}
```

1. ## Миграции
- Использовать Prisma или DrizzleORM для управления схемой.
- Создать начальные миграции для всех таблиц.
- Добавить индексы для часто используемых полей.
2. ## Подключение к базе
- Создать пул соединений.
- Реализовать middleware для обработки соединений.
- Добавить обработку ошибок и retry-логику.
3. ## Кэширование
- Реализовать гибридную систему кэширования:
  - PostgreSQL для метаданных.
  - Внешнее хранилище для изображений.
4. ## Мониторинг
- Добавить логирование SQL-запросов.
- Настроить метрики производительности.
- Реализовать отслеживание размера кэша.

## Требования к безопасности
- Подготовленные запросы
- Валидация входных данных
- RLS (Row Level Security)
- Аудит важных операций

## Производительность
- Оптимизировать запросы для аналитики.
- Использовать материализованные представления.
- Настроить партиционирование для таблицы cached_images.
- Реализовать фоновую очистку устаревших записей.

## Миграция данных
- Разработать план миграции существующих данных.
- Создать скрипты для переноса данных.
- Обеспечить нулевое время простоя при миграции.
- Реализовать механизм отката изменений.

## Следующие шаги
- Настройка окружения разработки.
- Создание и тестирование миграций.
- Реализация базовых CRUD операций.
- Интеграция с существующим кодом.
- Тестирование производительности.
- Развертывание и мониторинг.
