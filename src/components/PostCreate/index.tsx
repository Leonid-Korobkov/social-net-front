import { Controller, useForm } from 'react-hook-form'
import {
  useCreatePostMutation,
  useLazyGetAllPostsQuery,
} from '../../app/services/post.api'
import { Button, Textarea } from '@nextui-org/react'
import { IoMdCreate } from 'react-icons/io'

function CreatePost() {
  const [createPost, { isLoading }] = useCreatePostMutation()
  const [triggerAllPosts] = useLazyGetAllPostsQuery()

  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
    setValue,
  } = useForm()

  const error = errors?.text?.message as string

  const onSubmit = handleSubmit(async data => {
    try {
      await createPost({ content: data.text }).unwrap()
      setValue('text', '')
      await triggerAllPosts().unwrap()
    } catch (err) {
      console.error(err, errors)
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
        }}
        render={({ field }) => (
          <Textarea
            {...field}
            placeholder="О чем думаете?"
            labelPlacement="inside"
            errorMessage="Обязательное поле"
            isInvalid={error ? true : false}
            className="mb-5"
            label="Новый пост"
            variant="bordered"
            maxRows={10}
          />
        )}
      />
      <Button
        color="success"
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
