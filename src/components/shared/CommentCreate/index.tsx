'use client'
import { useCreateComment } from '@/services/api/comment.api'
import { hasErrorField } from '@/utils/hasErrorField'
import { Button, Textarea } from '@heroui/react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { IoMdCreate } from 'react-icons/io'

interface PageProps {
  params: {
    id: string
  }
}

function CreateComment({ params }: PageProps) {
  const { id } = params
  const { mutateAsync: createComment, isPending: isLoading } =
    useCreateComment()

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm()

  const onSubmit = handleSubmit(async data => {
    try {
      const toastId = toast.loading('Создание комментария...')
      const promise = createComment({
        content: data.comment,
        postId: id,
      })

      promise
        .then(() => {
          toast.success('Комментарий успешно создан!')
          setValue('comment', '')
          setTimeout(() => {
            // Скролл к комментарию
            window.scrollTo({
              top: document.documentElement.scrollHeight,
              behavior: 'smooth',
            })
          }, 100)
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
      console.error(err, errors)
      toast.error('Ошибка при создании поста')
    }
  })

  const error = errors?.comment?.message as string

  return (
    <form className="flex-grow" onSubmit={onSubmit}>
      <Controller
        name="comment"
        control={control}
        defaultValue=""
        rules={{
          required: 'Поле обязательно',
        }}
        render={({ field }) => (
          <Textarea
            {...field}
            placeholder="Напишите свой ответ"
            className="mb-5"
            labelPlacement="inside"
            errorMessage="Обязательное поле"
            isInvalid={error ? true : false}
            label="Комменарий к посту"
            variant="bordered"
            maxRows={10}
          />
        )}
      />
      <Button
        color="primary"
        className="flex-end"
        endContent={<IoMdCreate />}
        type="submit"
        isLoading={isLoading}
      >
        Ответить
      </Button>
    </form>
  )
}

export default CreateComment
