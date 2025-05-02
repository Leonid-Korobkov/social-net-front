import { MetadataRoute } from 'next'
import { APP_URL } from '@/app/constants'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/', // Закрываем API эндпоинты
        '/_next/', // Закрываем технические файлы
        '/images/', // Закрываем доступ к папке с изображениями
      ],
    },
    sitemap: `${APP_URL}/sitemap.xml`,
  }
}
