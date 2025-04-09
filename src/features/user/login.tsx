'use client'
import { Button, Input, Link, Alert } from '@heroui/react'
import { useForm } from 'react-hook-form'
import { SubmitHandler } from 'react-hook-form'
import { IoMdMail } from 'react-icons/io'
import {
  useLazyCurrentUserQuery,
  useLoginMutation,
} from '@/store/services/user.api'
import { useRouter } from 'next/navigation'
import { hasErrorField } from '../../utils/hasErrorField'
import {
  validateEmailPattern,
  validatePassword,
} from '../../utils/validateFieldsForm'
import { RiLockPasswordFill } from 'react-icons/ri'

interface IForm {
  email: string
  password: string
}

interface LoginProps {
  setSelected: (value: string) => void
  isRegisterSuccess: boolean
}

function Login({ setSelected, isRegisterSuccess }: LoginProps) {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IForm>({
    mode: 'onChange',
    reValidateMode: 'onChange',
  })

  const router = useRouter()
  const [login, { isLoading, error, isSuccess }] = useLoginMutation()
  const [triggerCurrentQuery] = useLazyCurrentUserQuery()

  const onSubmit: SubmitHandler<IForm> = async data => {
    try {
      await login(data).unwrap()
      await triggerCurrentQuery().unwrap()

      setTimeout(() => {
        router.push('/')
      }, 1000)
    } catch (err) {
      console.error(err, error)
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 h-full"
    >
      <Input
        label="Email"
        type="email"
        errorMessage={errors.email ? errors.email.message : ''}
        isInvalid={errors.email ? true : false}
        endContent={<IoMdMail className="form-icon" />}
        {...register('email', {
          required: 'Обязательное поле',
          pattern: {
            value: validateEmailPattern,
            message: `Некорректный email`,
          },
        })}
      />
      <Input
        label="Пароль"
        type="password"
        errorMessage={errors.password ? errors.password.message : ''}
        isInvalid={errors.password ? true : false}
        endContent={<RiLockPasswordFill className="form-icon" />}
        {...register('password', {
          required: 'Обязательное поле',
          validate: validatePassword,
        })}
      />

      <p className="text-center text-small">
        Нет аккаунта? -&nbsp;
        <Link
          size="sm"
          className="cursor-pointer"
          onPress={() => setSelected('register')}
        >
          Зарегистрируйтесь
        </Link>
      </p>

      <div className="flex gap-2 justify-end">
        <Button
          isLoading={isLoading || isSuccess}
          fullWidth
          color="secondary"
          type="submit"
        >
          {isSuccess ? 'Перенаправление...' : 'Войти'}
        </Button>
      </div>

      {error && hasErrorField(error) && (
        <Alert color="danger" title={error.data.error} />
      )}
      {isSuccess && <Alert color="success" title="Вход успешно выполнен" />}
    </form>
  )
}

export default Login
