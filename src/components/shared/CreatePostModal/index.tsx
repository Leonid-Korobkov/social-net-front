import { Modal, ModalContent, ModalHeader, ModalBody } from '@nextui-org/react'
import CreatePost from '../PostCreate'
import { useLocation, useNavigate } from 'react-router-dom'

interface CreatePostModalProps {
  isOpen: boolean
  onOpenChange: () => void
}

function CreatePostModal({ isOpen, onOpenChange }: CreatePostModalProps) {
  const navigate = useNavigate()
  const location = useLocation()

  const handleSuccess = () => {
    onOpenChange()
    if (location.pathname !== '/') {
      navigate('/')
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
