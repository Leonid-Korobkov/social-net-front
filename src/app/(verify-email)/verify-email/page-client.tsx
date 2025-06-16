'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useVerifyEmail, useResendVerification } from '@/services/api/user.api'
import { Alert, Button, Card, CardBody, InputOtp } from '@heroui/react'
import { Controller, useForm } from 'react-hook-form'
import { hasErrorField } from '@/utils/hasErrorField'
import toast from 'react-hot-toast'

interface IVerifyForm {
  verificationCode: string
}

export default function VerifyEmailPageClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [countdown, setCountdown] = useState(30)
  const [resendSuccess, setResendSuccess] = useState(false)

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<IVerifyForm>({})

  const {
    mutateAsync: verifyEmail,
    isPending: isVerifyLoading,
    error: verifyError,
    isSuccess: isVerifySuccess,
  } = useVerifyEmail()

  const {
    mutateAsync: resendCode,
    isPending: isResendLoading,
    error: resendError,
    isSuccess: isResendSuccess,
  } = useResendVerification()

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => prev - 1)
      }, 1000)
    }
    return () => {
      if (timer) clearInterval(timer)
    }
  }, [countdown])

  useEffect(() => {
    if (isResendSuccess) {
      toast.success('Код подтверждения отправлен повторно')
      setResendSuccess(true)
      const timer = setTimeout(() => {
        setResendSuccess(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isResendSuccess])

  const onSubmit = async (data: IVerifyForm) => {
    if (!token) return
    try {
      await verifyEmail({
        token,
        code: data.verificationCode,
      })
      toast.success('Email успешно подтвержден')
    } catch (error) {
      console.error('Verification error:', error)
    }
  }

  const handleResendCode = async () => {
    if (!token) return
    try {
      await resendCode({ token })
      setCountdown(30)
    } catch (error) {
      console.error('Resend code error:', error)
    }
  }

  useEffect(() => {
    if (isVerifySuccess) {
      setTimeout(() => {
        router.push('/')
      }, 1500)
    }
  }, [isVerifySuccess, router])

  if (!token) {
    return (
      <div className="flex flex-1 items-center justify-center w-full h-full flex-col ">
        <div className="flex flex-col w-full min-w-[390px] max-w-[690px] px-2">
          <Alert color="danger" title="Неверная ссылка для подтверждения" />
        </div>
      </div>
    )
  }

  // Показываем ошибки через toast
  useEffect(() => {
    if (verifyError) {
      const errorMessage = hasErrorField(verifyError)
        ? verifyError.data.error
        : verifyError.errorMessage
      toast.error(errorMessage)
    }
  }, [verifyError])

  useEffect(() => {
    if (resendError) {
      const errorMessage = hasErrorField(resendError)
        ? resendError.data.error
        : resendError.errorMessage
      toast.error(errorMessage)
    }
  }, [resendError])

  return (
    <div className="flex flex-1 items-center justify-center w-full h-full flex-col ">
      <div className="flex flex-col w-full max-w-[500px]">
        <Card className="m-5">
          <CardBody className="overflow-hidden">
            <div>
              <h2 className="mt-6 text-center text-2xl font-bold mb-3">
                Подтверждение email
              </h2>
              <p className="mt-2 text-center text-sm text-gray-400">
                Мы отправили код подтверждения на ваш email
              </p>
            </div>

            <form
              className="mt-8 space-y-6 flex flex-col"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="flex justify-center">
                <Controller
                  name="verificationCode"
                  control={control}
                  render={({ field }) => (
                    <InputOtp
                      {...field}
                      length={6}
                      size="md"
                      errorMessage={errors.verificationCode?.message}
                      isInvalid={!!errors.verificationCode}
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

              <div className="flex flex-col gap-2">
                <Button
                  isLoading={isVerifyLoading}
                  color="primary"
                  type="submit"
                >
                  Подтвердить
                </Button>
                <Button
                  onClick={handleResendCode}
                  isDisabled={countdown > 0 || isResendLoading}
                  type="button"
                >
                  {countdown > 0
                    ? `Отправить код повторно через ${countdown}с`
                    : 'Отправить код повторно'}
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
