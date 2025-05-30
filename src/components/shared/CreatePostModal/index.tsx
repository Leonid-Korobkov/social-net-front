'use client'
import useEditorText from '@/hooks/useEditorText'
import { useCreatePost } from '@/services/api/post.api'
import { hasErrorField } from '@/utils/hasErrorField'
import { pluralizeRu } from '@/utils/pluralizeRu'
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
import { FaRegSave, FaArrowRight } from 'react-icons/fa'
import { IoMdCreate } from 'react-icons/io'
import CreatePost from '../PostCreate'
import { useState, useEffect } from 'react'
import MediaUploader from '../MediaUploader'
import { UserSettingsStore } from '@/store/userSettings.store'
import { isPostEmpty, stripHtml } from '@/utils/stripHtml'
import Link from 'next/link'

interface CreatePostModalProps {
  isOpen: boolean
  onOpenChange: () => void
}

function CreatePostModal({ isOpen, onOpenChange }: CreatePostModalProps) {
  const { mutateAsync: createPost, isPending: isLoading } = useCreatePost()

  const [mediaUrls, setMediaUrls] = useState<string[]>([])

  useEffect(() => {
    const uploads = UserSettingsStore.getState().mediaUploads
    if (uploads && uploads.length > 0) {
      const urls = uploads
        .filter(u => u.status === 'success' && u.url)
        .map(u => u.url!)
      setMediaUrls(urls)
    }
  }, [])

  // Используем наш хук для редактора
  const {
    editor,
    content,
    clearContent,
    isEmpty,
    getHTML,
    characterCount,
    wordCount,
  } = useEditorText()

  // Обработчик успешного создания поста
  const handleSuccess = () => {
    // Очищаем медиа-загрузки из localStorage после успешной публикации
    UserSettingsStore.getState().resetMediaUploads()
    onOpenChange()
  }

  // Обработчик отправки поста
  const onSubmit = async () => {
    const html = getHTML()
    if (isPostEmpty(html, mediaUrls)) {
      toast.error('Нельзя отправить пустой пост')
      return
    }
    try {
      const toastId = toast.loading('Создание поста...')
      const contentToSend = stripHtml(html).trim() === '' ? '' : html
      const promise = createPost({
        content: contentToSend,
        media: mediaUrls,
      })

      promise
        .then(newPost => {
          toast.success(
            <span className="flex flex-col items-center gap-1 text-center">
              <span>Пост успешно создан!</span>
              <Link
                href={`/${newPost.author.userName}/post/${newPost.id}`}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-md font-semibold text-foreground hover:text-foreground-600 bg-foreground/10 hover:bg-foreground/20 transition-colors duration-200 mt-1"
              >
                Перейти к посту <FaArrowRight className="ml-1" />
              </Link>
            </span>
          )
          clearContent()
          setMediaUrls([])
          handleSuccess()
        })
        .catch(err => {
          if (hasErrorField(err)) {
            toast.error('Не удалось сохранить: ' + err.data.error)
          } else {
            toast.error('Произошла ошибка при создании поста')
          }
        })
        .finally(() => {
          toast.dismiss(toastId)
        })
    } catch (err) {
      console.error(err)
      toast.error('Ошибка при создании поста')
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
            <ModalHeader className="max-w-md:flex-col max-w-md:items-start flex flex-row gap-1 overflow-visible justify-between">
              Новый пост
              {/* Кнопка для закрытия и сохранения черновика */}
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
              <CreatePost
                onSuccess={handleSuccess}
                content={content}
                editor={editor}
                clearContent={clearContent}
                isEmpty={isEmpty}
                getHTML={getHTML}
                characterCount={characterCount}
                wordCount={wordCount}
              />
              {/* Компонент для загрузки медиа */}
              <div className="mt-4">
                <h3 className="text-medium font-semibold mb-2">
                  Добавить медиафайлы
                </h3>
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
                  {wordCount}{' '}
                  {pluralizeRu(wordCount, ['слово', 'слова', 'слов'])}
                </div>

                {/* Кнопка отправки */}
                <Button
                  color="primary"
                  className="flex-end"
                  endContent={<IoMdCreate />}
                  onClick={onSubmit}
                  isLoading={isLoading}
                >
                  Опубликовать пост
                </Button>
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

export default CreatePostModal
