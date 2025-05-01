'use client'

import RawHTML from '@/components/ui/EscapeHtml'

interface ProfileInfoProps {
  title: string
  info?: string | null
  isPrivate?: boolean
}

export default function ProfileInfo({
  title,
  info,
  isPrivate = false,
}: ProfileInfoProps) {
  if (!info || isPrivate) return null

  return (
    <div className="flex flex-col">
      <span className="text-medium text-gray-500">{title}</span>
      <span className="text-base">
        <RawHTML>{info}</RawHTML>
      </span>
    </div>
  )
}
