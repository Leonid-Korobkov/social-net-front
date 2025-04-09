'use client'
import { FaRegArrowAltCircleLeft } from 'react-icons/fa'

import { useRouter } from 'next/navigation'

function GoBack() {
  const router = useRouter()

  const handleGoBack = () => {
    router.back()
  }

  return (
    <div
      onClick={handleGoBack}
      className="text-default-500 flex items-center gap-2 mb-10 cursor-pointer"
    >
      <FaRegArrowAltCircleLeft />
      Назад
    </div>
  )
}

export default GoBack
