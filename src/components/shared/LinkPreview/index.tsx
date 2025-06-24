import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'
import CardSkeleton from '@/components/ui/CardSkeleton'
import { Skeleton } from '@heroui/react'
// Компонент предпросмотра OpenGraph-ссылки
function LinkPreview({ url }: { url: string }) {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!url) return
    setLoading(true)
    setError(null)
    fetch(`/api/og?url=${encodeURIComponent(url)}`)
      .then(res => {
        if (!res.ok) throw new Error('Ошибка загрузки OpenGraph')
        return res.json()
      })
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [url])

  if (!url) return null
  if (loading) return <LinkPreviewSkeleton />
  if (error) return null
  if (!data) return null

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className={cn(
        'block border border-default-400 rounded-xl p-3 mt-2 bg-default-100 hover:bg-default-200 transition',
        data.image && 'flex gap-2 flex-col xl:flex-row',
        !data.image && 'flex flex-col'
      )}
      style={{ textDecoration: 'none' }}
    >
      {data.image && (
        <div className="flex-1 flex items-center justify-start">
          <img
            src={data.image}
            alt={data.title || url}
            className="h-auto max-w-[400px] w-full rounded-lg"
          />
        </div>
      )}
      <div className="flex-1 flex flex-col justify-center min-w-0">
        <div className="font-semibold text-base mb-1">{data.title || url}</div>
        {data.description && (
          <div className="text-sm text-default-500 mb-1 line-clamp-3">
            {data.description}
          </div>
        )}
        <div className="text-xs text-primary-500 break-all">{url}</div>
      </div>
    </a>
  )
}

// Кастомный skeleton для LinkPreview
function LinkPreviewSkeleton() {
  return (
    <div className="flex flex-col md:flex-row gap-2 items-stretch w-full mt-2">
      <div className="w-full md:w-[200px] h-[120px] md:h-[120px] bg-default-200 rounded-lg flex-shrink-0">
        <Skeleton className="w-full h-full rounded-lg" />
      </div>
      <div className="flex-1 flex flex-col justify-center gap-2 py-1">
        <Skeleton className="h-5 w-3/4 rounded" /> {/* Заголовок */}
        <Skeleton className="h-4 w-full rounded" /> {/* Описание */}
        <Skeleton className="h-3 w-1/2 rounded" /> {/* Ссылка */}
      </div>
    </div>
  )
}

export default LinkPreview
