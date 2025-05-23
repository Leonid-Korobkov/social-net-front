import { useState } from 'react'
import { EditorContent } from '@tiptap/react'
import useEditorText from '@/hooks/useEditorText'
import { useCreateComment } from '@/services/api/comment.api'
import { hasErrorField } from '@/utils/hasErrorField'
import {
  Button,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/react'
import { toast } from 'react-hot-toast'
import { FaRegSave } from 'react-icons/fa'
import { IoMdCreate } from 'react-icons/io'
import MediaUploader from '../MediaUploader'
import { stripHtml, isPostEmpty, stripAllHtmlTags } from '@/utils/stripHtml'

interface CommentCreateRichModalProps {
  isOpen: boolean
  onOpenChange: () => void
  postId: string
}

export default function CommentCreateRichModal({
  isOpen,
  onOpenChange,
  postId,
}: CommentCreateRichModalProps) {
  const { mutateAsync: createComment, isPending: isLoading } =
    useCreateComment()
  const [mediaUrls, setMediaUrls] = useState<string[]>([])

  const {
    editor,
    content,
    clearContent,
    isEmpty,
    getHTML,
    characterCount,
    wordCount,
  } = useEditorText()

  const onSubmit = async () => {
    const html = getHTML()
    if (isPostEmpty(html, mediaUrls)) {
      toast.error('Нельзя отправить пустой комментарий')
      return
    }
    try {
      const toastId = toast.loading('Создание комментария...')
      const contentToSend = stripAllHtmlTags(html).trim() === '' ? '' : html
      const promise = createComment({
        content: contentToSend,
        postId,
        media: mediaUrls,
      })
      promise
        .then(() => {
          toast.success('Комментарий успешно создан!')
          clearContent()
          setMediaUrls([])
          onOpenChange()
        })
        .catch(err => {
          if (hasErrorField(err)) {
            toast.error('Не удалось сохранить: ' + err.data.error)
          } else {
            toast.error('Произошла ошибка при создании комментария')
          }
        })
        .finally(() => {
          toast.dismiss(toastId)
        })
    } catch (err) {
      console.error(err)
      toast.error('Ошибка при создании комментария')
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
            <ModalHeader className="flex flex-row gap-1 overflow-visible justify-between">
              Новый комментарий
              <Button
                color="success"
                size="sm"
                variant="flat"
                className="flex-end mr-3"
                endContent={<FaRegSave />}
                onClick={onOpenChange}
                isLoading={isLoading}
              >
                Сохранить черновик
              </Button>
            </ModalHeader>
            <Divider />
            <ModalBody>
              <div className="mb-4">
                <div className="mb-3">
                  {/* Сам редактор */}
                  {editor && (
                    <EditorContent editor={editor} className="w-full" />
                  )}
                </div>
                <MediaUploader onMediaChange={setMediaUrls} maxFiles={10} />
              </div>
            </ModalBody>
            <Divider />
            <ModalFooter>
              <div className="flex justify-between items-center w-full">
                <div
                  className={`character-count ${
                    characterCount > 9000 ? 'character-count--warning' : ''
                  }`}
                >
                  {characterCount} / 10000 символов
                  <br />
                  {wordCount} слов
                </div>
                <Button
                  color="primary"
                  className="flex-end"
                  endContent={<IoMdCreate />}
                  onClick={onSubmit}
                  isLoading={isLoading}
                >
                  Отправить
                </Button>
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
