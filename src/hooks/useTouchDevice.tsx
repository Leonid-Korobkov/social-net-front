import { useEffect, useState } from 'react'

export function useTouchDevice() {
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  // Определение сенсорного устройства
  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0)
  }, [])

  return { isTouchDevice }
}
