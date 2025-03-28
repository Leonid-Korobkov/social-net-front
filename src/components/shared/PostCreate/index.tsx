import { Controller, useForm } from 'react-hook-form'
import { useCreatePostMutation } from '../../../app/services/post.api'
import { Button, Textarea } from "@heroui/react"
import { IoMdCreate } from 'react-icons/io'
import { toast } from 'react-hot-toast'
import { hasErrorField } from '../../../utils/hasErrorField'

interface CreatePostProps {
  onSuccess?: () => void
}

function CreatePost({ onSuccess }: CreatePostProps) {
  const [createPost, { isLoading }] = useCreatePostMutation()

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm()

  const error = errors?.text?.message as string

  const onSubmit = handleSubmit(async data => {
    try {
      const toastId = toast.loading('Создание поста...')
      const promise = createPost({ content: data.text }).unwrap()

      promise
        .then(() => {
          toast.success('Пост успешно создан!')
          setValue('text', '')
          if (onSuccess) {
            onSuccess()
          }
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
      console.error(err, errors)
      toast.error('Ошибка при создании поста')
    }
  })

  return (
    <form className="flex-grow" onSubmit={onSubmit}>
      <Controller
        name="text"
        control={control}
        defaultValue=""
        rules={{
          required: 'Обязательное поле',
          validate: value =>
            value.trim().length > 0 || 'Пост не может быть пустым',
        }}
        render={({ field }) => (
          <Textarea
            {...field}
            placeholder="О чем думаете?"
            labelPlacement="inside"
            errorMessage={error}
            isInvalid={error ? true : false}
            className="mb-5"
            label="Новый пост"
            variant="bordered"
            maxRows={10}
          />
        )}
      />
      <Button
        color="secondary"
        className="flex-end"
        endContent={<IoMdCreate />}
        type="submit"
        isLoading={isLoading}
      >
        Добавить пост
      </Button>
    </form>
  )
}

export default CreatePost
