'use client'
import { usePathname } from 'next/navigation'
import Profile from '@/components/shared/Profile'

export default function ProfileSidebar() {
  const pathname = usePathname()
  const isUserProfilePage = pathname.match(/^\/users\/[^/]+$/)

  if (isUserProfilePage) {
    return null
  }

  return (
    <div className="flex-2 p-4 lg:sticky lg:top-16 hidden lg:block">
      <div className="flex-col flex gap-5">
        <Profile />
      </div>
    </div>
  )
}
