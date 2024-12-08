import { Alert, Button, Input, Link } from '@nextui-org/react'
import { useForm } from 'react-hook-form'
import type { SubmitHandler } from 'react-hook-form'
import { IoMdMail } from 'react-icons/io'
import { useRegisterUserMutation } from '../../app/services/user.api'
import { hasErrorField } from '../../utils/hasErrorField'
import { validatePassword } from '../../utils/validatePassword'

interface IForm {
  email: string
  password: string
  name: string
}

interface RegisterProps {
  setSelected: (value: string) => void
  setRegisterSuccess: (value: boolean) => void
}

function Register({ setSelected, setRegisterSuccess }: RegisterProps) {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IForm>({
    mode: 'onBlur',
    reValidateMode: 'onChange',
  })

  const [registerUser, { isLoading, error, isSuccess }] =
    useRegisterUserMutation()

  const onSubmit: SubmitHandler<IForm> = async data => {
    try {
      await registerUser(data).unwrap()
      setSelected('login')
      setRegisterSuccess(true)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 h-full"
    >
      <Input
        label="Имя"
        type="text"
        errorMessage={errors.name ? errors.name.message : ''}
        isInvalid={errors.name ? true : false}
        {...register('name', {
          required: 'Обязательное поле',
          minLength: { value: 3, message: 'Минимум 3 символа' },
        })}
      />
      <Input
        label="Email"
        type="email"
        errorMessage={errors.email?.message || ''}
        isInvalid={errors.email ? true : false}
        {...register('email', {
          required: 'Обязательное поле',
          pattern: {
            value: /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
            message: `Некорректный email`,
          },
        })}
      />
      <Input
        label="Пароль"
        type="password"
        errorMessage={errors.password ? errors.password.message : ''}
        isInvalid={errors.password ? true : false}
        {...register('password', {
          required: 'Обязательное поле',
          validate: validatePassword,
        })}
      />

      <p className="text-center text-small">
        Есть аккаунт? -&nbsp;
        <Link
          size="sm"
          className="cursor-pointer"
          onPress={() => setSelected('login')}
        >
          Войдите
        </Link>
      </p>

      <div className="flex gap-2 justify-end">
        <Button
          isLoading={isLoading || isSuccess}
          fullWidth
          color="secondary"
          type="submit"
        >
          {isSuccess ? 'Перенаправление...' : 'Зарегистрироваться'}
        </Button>
      </div>

      <div>
        {error && hasErrorField(error) && (
          <Alert color="danger" title={error.data.error} />
        )}
        {isSuccess && (
          <Alert color="success" title="Регистрация выполнена успешно" />
        )}
      </div>
    </form>
  )
}

export default Register
