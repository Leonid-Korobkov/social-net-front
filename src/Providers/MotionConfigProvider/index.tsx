'use client'
import { UserSettingsStore } from '@/store/userSettings.store'
import { MotionConfig } from 'framer-motion'

function MotionConfigProvider({ children }: { children: React.ReactNode }) {
  const reduce = UserSettingsStore.getState().reduceAnimation
  return (
    <>
      <MotionConfig reducedMotion={reduce ? 'always' : 'never'}>
        {children}
      </MotionConfig>
    </>
  )
}

export default MotionConfigProvider
