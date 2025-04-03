'use client'
import RawHTML from '../../ui/EscapeHtml'

interface IProfileInfo {
  title: string
  info?: string
}

function ProfileInfo({ title, info }: IProfileInfo) {
  if (!info) return null
  return (
    <div className="font-semibold flex flex-row items-baseline flex-wrap">
      <div className="text-gray-500 text-medium mr-2">{title}:</div>
      <div className="text-gray-400 text-small">
        <RawHTML>{info}</RawHTML>
      </div>
    </div>
  )
}

export default ProfileInfo
