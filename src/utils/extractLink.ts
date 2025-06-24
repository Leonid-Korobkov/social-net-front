// Утилита для извлечения первой ссылки из HTML
export function extractFirstLink(html: string): string | null {
  if (!html) return null
  const match = html.match(/<a [^>]*href=["']([^"']+)["'][^>]*>/i)
  return match ? match[1] : null
}
