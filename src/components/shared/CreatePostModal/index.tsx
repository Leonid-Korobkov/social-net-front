'use client'
import { Modal, ModalBody, ModalContent, ModalHeader } from '@heroui/react'
import CreatePost from '../PostCreate'

interface CreatePostModalProps {
  isOpen: boolean
  onOpenChange: () => void
}

function CreatePostModal({ isOpen, onOpenChange }: CreatePostModalProps) {
  const handleSuccess = () => {
    onOpenChange()
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
