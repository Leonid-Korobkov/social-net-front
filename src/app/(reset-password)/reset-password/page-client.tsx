'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import {
  useForgotPassword,
  useVerifyResetCode,
  useResetPassword,
} from '@/services/api/user.api'
import { Alert, Button, Card, CardBody, Input, InputOtp } from '@heroui/react'
import { useForm, Controller } from 'react-hook-form'
import toast from 'react-hot-toast'
import {
  validateEmailPattern,
  validatePassword,
} from '@/utils/validateFieldsForm'
import { IoMdMail } from 'react-icons/io'
import { IoEye, IoEyeOff } from 'react-icons/io5'
import { useAuth } from '@/hooks/useAuth'

// Три шага сброса пароля
enum Steps {
  EmailInput = 1,
  CodeVerification = 2,
  NewPassword = 3,
}

interface EmailFormValues {
  email: string
}
interface CodeFormValues {
  code: string
}
interface PasswordFormValues {
  newPassword: string
  confirmPassword: string
}

export default function ResetPasswordPageClient() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()

  const [step, setStep] = useState<Steps>(
    isAuthenticated ? Steps.CodeVerification : Steps.EmailInput
  )
  const [email, setEmail] = useState<string>(isAuthenticated ? user!.email : '')
  const [code, setCode] = useState<string>('')
  const [timer, setTimer] = useState<number>(0)

  const [isSendCodeToAuthenticatedUser, setIsSendCodeToAuthenticatedUser] =
    useState<boolean>(true)

  const [isVisibleNewPwd, setIsVisibleNewPwd] = useState<boolean>(false)
  const [isVisibleConfirmPwd, setIsVisibleConfirmPwd] = useState<boolean>(false)

  // API хуки
  const { mutateAsync: sendCode, isPending: loadingEmail } = useForgotPassword()
  const { mutateAsync: verifyCode, isPending: loadingCode } =
    useVerifyResetCode()
  const { mutateAsync: resetPwd, isPending: loadingReset } = useResetPassword()

  // React Hook Form
  const emailForm = useForm<EmailFormValues>({ mode: 'onBlur' })
  const codeForm = useForm<CodeFormValues>({ mode: 'onBlur' })
  const passwordForm = useForm<PasswordFormValues>({ mode: 'onBlur' })

  // Таймер для повторной отправки
  useEffect(() => {
    if (step === Steps.CodeVerification && timer > 0) {
      const id = setTimeout(() => setTimer(timer - 1), 1000)
      return () => clearTimeout(id)
    }
  }, [timer, step])

  // Шаг 1: отправка email
  const onSubmitEmail = emailForm.handleSubmit(async ({ email }) => {
    setEmail(email)
    await sendCode({ email })
    setStep(Steps.CodeVerification)
    setTimer(30)
  })

  // Шаг 2: проверка кода
  const onSubmitCode = codeForm.handleSubmit(async ({ code }) => {
    setCode(code)
    await verifyCode({ email, code })
    setStep(Steps.NewPassword)
  })

  // Шаг 3: установка нового пароля
  const onSubmitPassword = passwordForm.handleSubmit(
    async ({ newPassword, confirmPassword }) => {
      if (newPassword !== confirmPassword) {
        passwordForm.setError('confirmPassword', {
          type: 'manual',
          message: 'Пароли не совпадают',
        })
        return
      }
      await resetPwd({ email, code, newPassword })
      router.push('/')
    }
  )

  // Повторная отправка кода
  const handleResend = async () => {
    await sendCode({ email })
    setTimer(30)
  }

  if (isSendCodeToAuthenticatedUser && isAuthenticated) {
    handleResend()
    setIsSendCodeToAuthenticatedUser(false)
    setTimer(30)
  }

  // Функция рендера текущего шага
  const renderStep = () => {
    switch (step) {
      case Steps.EmailInput:
        return (
          <>
            <div>
              <h2 className="mt-6 text-center text-2xl font-bold mb-3">
                Забыли пароль?
              </h2>
              <p className="mt-2 text-sm text-gray-400">
                Введите подтвержденный адрес электронной почты вашей учетной
                записи, и мы отправим вам код для подтверждения, чтобы сбросить
                пароль.
              </p>
            </div>

            <form onSubmit={onSubmitEmail} className="mt-8 space-y-4">
              <Input
                label="Введите ваш E-mail"
                type="email"
                endContent={<IoMdMail className="form-icon" />}
                autoComplete="email"
                {...emailForm.register('email', {
                  required: 'Обязательное поле',
                  pattern: {
                    value: validateEmailPattern,
                    message: `Некорректный email`,
                  },
                })}
                isInvalid={!!emailForm.formState.errors.email}
                errorMessage={emailForm.formState.errors.email?.message}
              />
              <Button
                color="primary"
                fullWidth
                isLoading={loadingEmail}
                type="submit"
              >
                Отправить код
              </Button>
            </form>
          </>
        )
      case Steps.CodeVerification:
        return (
          <>
            <div>
              <h2 className="mt-6 text-center text-2xl font-bold mb-3">
                Код подтверждения
              </h2>
              <p className="mt-2 text-center text-sm text-gray-400">
                Мы отправили код подтверждения на ваш email.
              </p>
            </div>

            <form onSubmit={onSubmitCode} className="mt-8 space-y-4">
              <div className="flex justify-center">
                <Controller
                  name="code"
                  control={codeForm.control}
                  render={({ field }) => (
                    <InputOtp
                      {...field}
                      length={6}
                      size="md"
                      isInvalid={!!codeForm.formState.errors.code}
                      errorMessage={codeForm.formState.errors.code?.message}
                    />
                  )}
                  rules={{
                    required: 'Введите код подтверждения',
                    minLength: {
                      value: 6,
                      message: 'Пожалуйста, введите все 6 цифр',
                    },
                  }}
                />
              </div>
              <Button
                color="primary"
                fullWidth
                isLoading={loadingCode}
                type="submit"
              >
                Подтвердить
              </Button>
              <Button
                fullWidth
                disabled={timer > 0}
                type="button"
                onClick={handleResend}
              >
                {timer > 0
                  ? `Отправить код повторно через ${timer}s`
                  : 'Отправить код повторно'}
              </Button>
            </form>
          </>
        )
      case Steps.NewPassword:
        return (
          <>
            <div>
              <h2 className="mt-6 text-center text-2xl font-bold mb-3">
                Сброс пароля
              </h2>
              <p className="mt-2 text-sm text-gray-400">
                Придумайте новый пароль. Пароль должен содержать от 6 до 24
                символов, включать как минимум одну заглавную и одну строчную
                букву, одну цифру, а также один специальный символ (например: !,
                @, #, $, %, ^, & и т.д.).
              </p>
            </div>
            <form onSubmit={onSubmitPassword} className="mt-8 space-y-4">
              <Input
                label="Новый пароль"
                type={isVisibleNewPwd ? 'text' : 'password'}
                isInvalid={!!passwordForm.formState.errors.newPassword}
                errorMessage={
                  passwordForm.formState.errors.newPassword?.message
                }
                endContent={
                  <button
                    aria-label="toggle password visibility"
                    className="focus:outline-none flex items-center justify-center h-full"
                    type="button"
                    onClick={() => setIsVisibleNewPwd(!isVisibleNewPwd)}
                  >
                    {isVisibleNewPwd ? (
                      <IoEye className="form-icon text-default-400" />
                    ) : (
                      <IoEyeOff className="form-icon text-default-400" />
                    )}
                  </button>
                }
                {...passwordForm.register('newPassword', {
                  required: 'Обязательное поле',
                  validate: validatePassword,
                })}
              />
              <Input
                label="Подтвердите пароль"
                type={isVisibleConfirmPwd ? 'text' : 'password'}
                isInvalid={!!passwordForm.formState.errors.confirmPassword}
                errorMessage={
                  passwordForm.formState.errors.confirmPassword?.message
                }
                endContent={
                  <button
                    aria-label="toggle password visibility"
                    className="focus:outline-none flex items-center justify-center h-full"
                    type="button"
                    onClick={() => setIsVisibleConfirmPwd(!isVisibleConfirmPwd)}
                  >
                    {isVisibleConfirmPwd ? (
                      <IoEye className="form-icon text-default-400" />
                    ) : (
                      <IoEyeOff className="form-icon text-default-400" />
                    )}
                  </button>
                }
                {...passwordForm.register('confirmPassword', {
                  required: 'Обязательное поле',
                })}
              />
              <Button
                color="primary"
                fullWidth
                isLoading={loadingReset}
                type="submit"
              >
                Установить пароль
              </Button>
            </form>
          </>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center w-full h-full flex-col ">
      <div className="flex flex-col w-full max-w-[500px]">
        <Card className="m-5">
          <CardBody>{renderStep()}</CardBody>
        </Card>
      </div>
    </div>
  )
}
