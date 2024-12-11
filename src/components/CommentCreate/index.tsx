import { Alert, Button, Textarea } from '@nextui-org/react'
import { IoMdCreate } from 'react-icons/io'
import { useForm, Controller } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import { useCreateCommentMutation } from '../../app/services/comment.api'
import { useLazyGetPostByIdQuery } from '../../app/services/post.api'

function CreateComment() {
  const { id } = useParams<{ id: string }>()
  const [createComment, { isLoading }] = useCreateCommentMutation()
  const [getPostById] = useLazyGetPostByIdQuery()

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm()

  const onSubmit = handleSubmit(async data => {
    try {
      if (id) {
        await createComment({ content: data.comment, postId: id }).unwrap()
        await getPostById(id).unwrap()
        setValue('comment', '')
      }
    } catch (error) {
      console.error('err', error)
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
