'use client'

import { useRouter } from 'next/navigation'
import { TbArrowLeft } from 'react-icons/tb'

function GoBack() {
  const router = useRouter()

  const handleGoBack = () => {
    router.back()
  }

  return (
    <div className="flex">
      <div
        onClick={handleGoBack}
        className="text-foreground text-sm gap-2 mb-4 cursor-pointer
      px-1 py-1 rounded-full border border-default-200 bg-content1 hover:bg-default-200/70 transition-colors"
      >
        <TbArrowLeft />
      </div>
    </div>
  )
}

export default GoBack
