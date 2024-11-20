export function normalizeUrl(url: string): string {
  try {
    const urlObject = new URL(url)
    const pathname = urlObject.pathname
    const normalizedPathname = pathname.endsWith('/') ? pathname : `${pathname}/`
    return `${urlObject.origin}${normalizedPathname}${urlObject.search}`
  } catch (error) {
    console.error('Error normalizing URL:', error)
    return url
  }
}

export function normalizePath(path: string): string {
  try {
    // Убираем повторяющиеся слэши
    const cleanPath = path.replace(/\/+/g, '/')
    // Добавляем слэш в начало, если его нет
    const withLeadingSlash = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`
    // Добавляем слэш в конец, если его нет
    return withLeadingSlash.endsWith('/') ? withLeadingSlash : `${withLeadingSlash}/`
  } catch (error) {
    console.error('Error normalizing path:', error)
    return path
  }
} 