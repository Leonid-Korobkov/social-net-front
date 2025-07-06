'use client'
import SessionTerminationModal from '@/components/sessions/SessionTerminationModal'
import { useModalsStore } from '@/store/modals.store'

export default function ModalsProvider() {
  const { isSessionTerminationOpen, closeSessionTermination } = useModalsStore()

  return (
    <>
      <SessionTerminationModal
        isOpen={isSessionTerminationOpen}
        onClose={closeSessionTermination}
        title="Эта сессия была завершена с другого устройства"
        message="Ваша сессия истекла, пожалуйста, войдите снова"
      />
    </>
  )
}
