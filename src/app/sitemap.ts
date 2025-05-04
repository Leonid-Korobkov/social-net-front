import { MetadataRoute } from 'next'
import axios from 'axios'
import { APP_URL } from './constants'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Основные статические страницы
  return [
    {
      url: `${APP_URL}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${APP_URL}/auth`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${APP_URL}/search`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
  ]
}
