'use client'
import CreatePost from '@/components/shared/PostCreate'
import useEditorText from '@/hooks/useEditorText'
import { useCreatePost } from '@/services/api/post.api'
import { hasErrorField } from '@/utils/hasErrorField'
import { pluralizeRu } from '@/utils/pluralizeRu'
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
} from '@heroui/react'
import { IoMdCreate } from 'react-icons/io'
import { FaRegSave } from 'react-icons/fa'
import { toast } from 'react-hot-toast'
import { IoArrowBack } from 'react-icons/io5'
import { useRouter } from 'next/navigation'
import GoBack from '@/components/layout/GoBack'

export default function CreatePostPage() {
  const { mutateAsync: createPost, isPending: isLoading } = useCreatePost()
  const router = useRouter()

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
    router.push('/')
  }

  // Обработчик отправки поста
  const onSubmit = async () => {
    try {
      if (!editor || editor?.isEmpty) {
        toast.error('Пост не может быть пустым')
        return
      }

      const toastId = toast.loading('Создание поста...')
      const promise = createPost({ content: getHTML() })

      promise
        .then(() => {
          toast.success('Пост успешно создан!')
          clearContent()
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

  // Обработчик сохранения черновика
  const saveDraft = () => {
    router.push('/')
  }

  return (
    <div className="container mx-auto h-full w-full">
      <Card style={{ height: 'calc(100vh - 180px)' }}>
        <CardHeader className="max-w-md:flex-col max-w-md:items-start flex flex-row gap-1 overflow-visible justify-between">
          <h1 className="text-large font-bold">Новый пост</h1>
          <Button
            color="success"
            size="sm"
            variant="flat"
            className="flex-end"
            endContent={<FaRegSave />}
            onClick={saveDraft}
            isLoading={isLoading}
          >
            Сохранить
          </Button>
        </CardHeader>
        <Divider />
        <CardBody className='overflow-auto'>
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
        </CardBody>
        <Divider />
        <CardFooter className='flex-shrink-0'>
          <div className="flex justify-between items-start w-full gap-1">
            <div
              className={`character-count ${
                characterCount > 9000 ? 'character-count--warning' : ''
              }`}
            >
              {characterCount} / 10000 символов
              <br />
              {wordCount} {pluralizeRu(wordCount, ['слово', 'слова', 'слов'])}
            </div>

            <div className="flex gap-2 flex-col">
              <Button
                color="secondary"
                variant="shadow"
                endContent={<IoMdCreate />}
                onClick={onSubmit}
                isLoading={isLoading}
              >
                Опубликовать пост
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
