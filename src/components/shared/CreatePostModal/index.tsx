'use client'
import { Modal, ModalContent, ModalHeader, ModalBody } from '@heroui/react'
import CreatePost from '../PostCreate'
import { usePathname, useRouter } from 'next/navigation'

interface CreatePostModalProps {
  isOpen: boolean
  onOpenChange: () => void
}

function CreatePostModal({ isOpen, onOpenChange }: CreatePostModalProps) {
  const router = useRouter()
  const pathname = usePathname()

  const handleSuccess = () => {
    onOpenChange()
    if (pathname !== '/') {
      router.push('/')
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="2xl"
      scrollBehavior="inside"
      backdrop="blur"
    >
      <ModalContent className="pb-2">
        {onClose => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Создание поста
            </ModalHeader>
            <ModalBody>
              <CreatePost onSuccess={handleSuccess} />
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

export default CreatePostModal
