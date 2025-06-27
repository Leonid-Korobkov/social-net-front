import { cn } from '@/lib/utils'
import { Skeleton } from '@heroui/react'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { BACKEND_URL_FOR_WEBPUSH } from '@/app/constants'

interface LinkPreviewProps {
  url: string
  postId?: string
  ogImageUrl?: string | null
  ogTitle?: string | null
  ogDescr?: string | null
  ogUrl?: string | null
}

function LinkPreview({
  url,
  postId,
  ogImageUrl,
  ogTitle,
  ogDescr,
  ogUrl,
}: LinkPreviewProps) {
  const hasOG = ogImageUrl || ogTitle || ogDescr || ogUrl
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (hasOG) return
    if (!url) return
    setLoading(true)
    setError(null)
    axios
      .post(`${BACKEND_URL_FOR_WEBPUSH}/api/og/link-preview`, { url, postId })
      .then(res => setData(res.data))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [url, postId, hasOG])

  if (!url) return null
  if (!hasOG && loading) return <LinkPreviewSkeleton />
  if (!hasOG && error) return null

  const previewData = hasOG
    ? {
        ogImageUrl,
        ogTitle,
        ogDescr,
        ogUrl: ogUrl || url,
      }
    : data

  if (!previewData) return null

  return (
    <a
      href={previewData.ogUrl || url}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className={cn(
        'block border border-default-400 rounded-xl p-3 mt-2 bg-default-100 hover:bg-default-200 transition',
        previewData.ogImageUrl && 'flex gap-2 flex-col xl:flex-row',
        !previewData.ogImageUrl && 'flex flex-col'
      )}
      style={{ textDecoration: 'none' }}
    >
      {previewData.ogImageUrl && (
        <div className="flex-1 flex items-center justify-start">
          <img
            src={previewData.ogImageUrl}
            alt={previewData.ogTitle || url}
            className="h-auto max-w-[400px] w-full rounded-lg"
          />
        </div>
      )}
      <div className="flex-1 flex flex-col justify-center min-w-0">
        <div className="font-semibold text-base mb-1">
          {previewData.ogTitle || url}
        </div>
        {previewData.ogDescr && (
          <div className="text-sm text-default-500 mb-1 line-clamp-3">
            {previewData.ogDescr}
          </div>
        )}
        <div className="text-xs text-primary-500 break-all">
          {previewData.ogUrl || url}
        </div>
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
