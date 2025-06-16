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

interface IRegisterForm {
  email: string
  password: string
  name: string
  userName: string
}

interface RegisterProps {
  setSelected: (value: string) => void
}

function Register({ setSelected }: RegisterProps) {
  const [isVisiblePass, setIsVisiblePass] = useState(false)
  const router = useRouter()

  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
  } = useForm<IRegisterForm>({
    mode: 'onChange',
    reValidateMode: 'onChange',
  })

  const {
    mutateAsync: registerUser,
    isPending: isRegisterLoading,
    error: registerError,
    isSuccess: isRegisterSuccess,
  } = useRegister()

  const onSubmit: SubmitHandler<IRegisterForm> = async data => {
    setIsVisiblePass(false)
    const response = await registerUser(data)
    if (response) {
      const verificationToken = btoa(`${response.id}_${Date.now()}`)
      router.push(`/verify-email?token=${verificationToken}`)
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 h-full"
      autoComplete="on"
    >
      <Input
        label="Имя"
        type="text"
        autoComplete="off"
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
            autoComplete="off"
            errorMessage={errors.userName?.message || ''}
            isInvalid={errors.userName ? true : false}
            placeholder="username_100500"
            onChange={e => field.onChange(e.target.value.toLowerCase())}
          />
        )}
      />

      <Divider className="my-2" />

      <Controller
        name="email"
        control={control}
        rules={{
          required: 'Обязательное поле',
          pattern: {
            value: validateEmailPattern,
            message: `Некорректный email`,
          },
        }}
        render={({ field }) => (
          <Input
            {...field}
            label="Email"
            type="email"
            autoComplete="email"
            errorMessage={errors.email?.message || ''}
            isInvalid={errors.email ? true : false}
            endContent={<IoMdMail className="form-icon" />}
            placeholder="example@gmail.com"
            onChange={e => field.onChange(e.target.value.toLowerCase())}
          />
        )}
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
        <Button
          isLoading={isRegisterLoading}
          fullWidth
          color="primary"
          type="submit"
        >
          Зарегистрироваться
        </Button>
      </div>

      <div>
        <div className="text-sm text-default-400 mb-2">
          После регистрации вам будет отправлен код подтверждения на ваш email.
        </div>
        {(registerError && hasErrorField(registerError) && (
          <Alert color="danger" title={registerError.data.error} />
        )) ||
          (registerError && (
            <Alert color="danger" title={registerError.errorMessage} />
          ))}
        {isRegisterSuccess && (
          <Alert color="success" title="Регистрация выполнена успешно" />
        )}
      </div>
    </form>
  )
}

export default Register
