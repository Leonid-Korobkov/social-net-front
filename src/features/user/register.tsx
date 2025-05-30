'use client'
import { useRegister } from '@/services/api/user.api'
import { hasErrorField } from '@/utils/hasErrorField'
import {
  validateEmailPattern,
  validatePassword,
  validateUserName,
} from '@/utils/validateFieldsForm'
import { Alert, Button, Divider, Input, Link } from '@heroui/react'
import { useState } from 'react'
import { SubmitHandler, useForm, Controller } from 'react-hook-form'
import { IoMdMail } from 'react-icons/io'
import { IoEye, IoEyeOff } from 'react-icons/io5'
import { useRouter } from 'next/navigation'

interface IForm {
  email: string
  password: string
  name: string
  userName: string
}

interface RegisterProps {
  setSelected: (value: string) => void
  setRegisterSuccess: (value: boolean) => void
}

function Register({ setSelected, setRegisterSuccess }: RegisterProps) {
  const [isVisiblePass, setIsVisiblePass] = useState(false)
  const router = useRouter()

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    control,
  } = useForm<IForm>({
    mode: 'onChange',
    reValidateMode: 'onChange',
  })

  const {
    mutateAsync: registerUser,
    isPending: isLoading,
    error,
    isSuccess,
  } = useRegister()

  const onSubmit: SubmitHandler<IForm> = async data => {
    setIsVisiblePass(false)
    await registerUser(data)
    setRegisterSuccess(true)
    setTimeout(() => {
      router.push('/auth?tab=login')
      setSelected('login')
    }, 1500)
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 h-full"
      autoComplete="on"
    >
      <Input
        label="Email"
        type="email"
        autoComplete="email"
        errorMessage={errors.email?.message || ''}
        isInvalid={errors.email ? true : false}
        endContent={<IoMdMail className="form-icon" />}
        placeholder="example@gmail.com"
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
        autoComplete="new-password"
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

      <Divider className="my-2" />

      <Input
        label="Имя"
        type="text"
        errorMessage={errors.name ? errors.name.message : ''}
        isInvalid={errors.name ? true : false}
        placeholder="Иван Петрович"
        {...register('name', {
          required: 'Обязательное поле',
          minLength: { value: 3, message: 'Минимум 3 символа' },
          validate: value => {
            if (value.trim() === '') {
              return 'Имя не может содержать пробелы'
            }
            return true
          },
        })}
      />
      <Controller
        name="userName"
        control={control}
        rules={{
          required: 'Обязательное поле',
          validate: validateUserName,
        }}
        render={({ field }) => (
          <Input
            {...field}
            label="Имя пользователя"
            type="text"
            errorMessage={errors.userName?.message || ''}
            isInvalid={errors.userName ? true : false}
            placeholder="username_100500"
            onChange={e => field.onChange(e.target.value.toLowerCase())}
          />
        )}
      />

      <p className="text-center text-small">
        Есть аккаунт? -&nbsp;
        <Link
          size="sm"
          className="cursor-pointer"
          onClick={() => setSelected('login')}
        >
          Войдите
        </Link>
      </p>

      <div className="flex gap-2 justify-end">
        <Button isLoading={isLoading} fullWidth color="primary" type="submit">
          Зарегистрироваться
        </Button>
      </div>

      <div>
        <div className="text-sm text-default-400 mb-2">
          *После регистрации пройдите процесс авторизации.
        </div>
        {(error && hasErrorField(error) && (
          <Alert color="danger" title={error.data.error} />
        )) ||
          (error && <Alert color="danger" title={error.errorMessage} />)}
        {isSuccess && (
          <Alert color="success" title="Регистрация выполнена успешно" />
        )}
      </div>
    </form>
  )
}

export default Register
