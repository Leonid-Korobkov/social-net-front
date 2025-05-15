'use client'
import { useLogin } from '@/services/api/user.api'
import { Alert, Button, Input, Link } from '@heroui/react'
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { IoMdMail } from 'react-icons/io'
import { IoEye, IoEyeOff } from 'react-icons/io5'
import {
  validateEmailPattern,
  validatePassword,
} from '../../utils/validateFieldsForm'
import { useRouter } from 'next/navigation'
interface IForm {
  email: string
  password: string
}

interface LoginProps {
  setSelected: (value: string) => void
  isRegisterSuccess: boolean
}

function Login({ setSelected, isRegisterSuccess }: LoginProps) {
  const [isVisiblePass, setIsVisiblePass] = useState(false)
  const router = useRouter()

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IForm>({
    mode: 'onChange',
    reValidateMode: 'onChange',
  })

  const {
    mutateAsync: login,
    isPending: isLoading,
    error,
    isSuccess,
  } = useLogin()

  const onSubmit: SubmitHandler<IForm> = async data => {
    await login(data)
  }

  useEffect(() => {
    if (isSuccess) {
      router.push('/')
    }
  }, [isSuccess, router])

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
        type={isVisiblePass ? 'text' : 'password'}
        errorMessage={errors.password ? errors.password.message : ''}
        isInvalid={errors.password ? true : false}
        endContent={
          <button
            aria-label="toggle password visibility"
            className="focus:outline-none flex items-center justify-center h-full"
            type="button"
            onClick={() => setIsVisiblePass(!isVisiblePass)}
          >
            {isVisiblePass ? (
              <IoEye className="form-icon text-default-400" />
            ) : (
              <IoEyeOff className="form-icon text-default-400" />
            )}
          </button>
        }
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
          onClick={() => setSelected('register')}
        >
          Зарегистрируйтесь
        </Link>
      </p>

      <div className="flex gap-2 justify-end">
        <Button
          isLoading={isLoading || isSuccess}
          fullWidth
          color="primary"
          type="submit"
        >
          {isSuccess ? 'Перенаправление...' : 'Войти'}
        </Button>
      </div>

      {error && <Alert color="danger" title={error.errorMessage} />}
      {isSuccess && <Alert color="success" title="Вход успешно выполнен" />}
    </form>
  )
}

export default Login
