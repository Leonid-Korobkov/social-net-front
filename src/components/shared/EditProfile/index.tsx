'use client'
import { ApiErrorResponse } from '@/services/ApiConfig'
import { useUpdateUser } from '@/services/api/user.api'
import { User } from '@/store/types'
import type { Selection } from '@heroui/react'
import {
  Alert,
  Button,
  Card,
  CardBody,
  Input,
  Select,
  SelectItem,
  Textarea
} from '@heroui/react'
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { IoMdMail } from 'react-icons/io'
import { IoCloseOutline } from 'react-icons/io5'
import { useCloudinaryImage } from '../../../hooks/useCloudinaryImage'
import { hasErrorField } from '../../../utils/hasErrorField'
import {
  validateEmailPattern,
  validateUserName,
} from '../../../utils/validateFieldsForm'
import ImageUpload from '../ImageUpload'

interface EditProfileProps {
  user: User
}

function EditProfile({ user }: EditProfileProps) {
  const { mutateAsync: updateUser, isPending: isLoading } = useUpdateUser()
  const [error, setError] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | string | null>(null)
  const { getOptimizedUrl } = useCloudinaryImage({
    src: user?.avatarUrl,
  })

  // стейт для дня, месяца, года
  const [selectedDay, setSelectedDay] = React.useState<Selection>(new Set([]))
  const [selectedMonth, setSelectedMonth] = React.useState<Selection>(
    new Set([])
  )
  const [selectedYear, setSelectedYear] = React.useState<Selection>(new Set([]))

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
    setValue,
  } = useForm<User>({
    mode: 'onChange',
    reValidateMode: 'onBlur',
    defaultValues: {
      email: user?.email,
      name: user?.name,
      dateOfBirth: user?.dateOfBirth,
      bio: user?.bio,
      location: user?.location,
      userName: user?.userName,
    },
  })

  useEffect(() => {
    if (user) {
      reset(user)
    }
  }, [user, reset])

  // --- Синхронизация стейтов с field.value ---
  useEffect(() => {
    if (control?._formValues?.dateOfBirth) {
      const date = new Date(control._formValues.dateOfBirth)
      setSelectedDay(new Set([date.getDate().toString()]))
      setSelectedMonth(new Set([date.getMonth().toString()]))
      setSelectedYear(new Set([date.getFullYear().toString()]))
    } else {
      setSelectedDay(new Set([]))
      setSelectedMonth(new Set([]))
      setSelectedYear(new Set([]))
    }
  }, [control?._formValues?.dateOfBirth])

  const onSubmit = async (data: User) => {
    try {
      const formData = new FormData()
      formData.append('name', data.name?.trim() || '')
      if (data.email !== user?.email) {
        formData.append('email', data.email?.trim() || '')
      }
      formData.append(
        'dateOfBirth',
        data.dateOfBirth ? new Date(data.dateOfBirth).toISOString() : ''
      )
      formData.append('bio', data.bio?.trim() || '')
      formData.append('location', data.location?.trim() || '')
      formData.append('userName', data.userName?.trim() || '')

      if (selectedFile) {
        if (typeof selectedFile == 'string') {
          formData.append('avatar', selectedFile)
        } else if (typeof selectedFile == 'object') {
          formData.append(
            'avatar',
            new File([selectedFile], `${data.email}_${Date.now()}.png`, {
              type: selectedFile.type,
            })
          )
        }
      }

      const promise = updateUser({
        body: formData,
        username: user?.userName?.toString() || '',
      })

      const toastId = toast.loading('Сохранение...')

      promise
        .then(() => {
          toast.success('Профиль обновлен!')
          setSelectedFile(null)
        })
        .catch((err: ApiErrorResponse) => {
          setError(err.errorMessage)
          toast.error('Не удалось сохранить: ' + err.errorMessage)
        })
        .finally(() => {
          toast.dismiss(toastId)
        })
    } catch (err) {
      if (hasErrorField(err)) {
        setError(err.data.error)
      }
    }
  }

  return (
    <Card>
      <CardBody>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <ImageUpload
            onChange={file => setSelectedFile(file)}
            currentImageUrl={getOptimizedUrl()}
            className="mb-2"
            onError={message => {
              toast.error(message)
            }}
          />
          <Input
            label="Email"
            labelPlacement="outside"
            type="email"
            errorMessage={errors.email?.message || ''}
            isInvalid={errors.email ? true : false}
            variant="bordered"
            endContent={<IoMdMail className="form-icon" />}
            {...register('email', {
              required: 'Обязательное поле',
              pattern: {
                value: validateEmailPattern,
                message: `Некорректный email`,
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
                labelPlacement="outside"
                type="text"
                errorMessage={errors.userName?.message || ''}
                isInvalid={errors.userName ? true : false}
                placeholder="username_100500"
                variant="bordered"
                onChange={e => field.onChange(e.target.value.toLowerCase())}
              />
            )}
          />
          <Input
            label="Имя"
            labelPlacement="outside"
            type="text"
            errorMessage={errors.name?.message || ''}
            isInvalid={errors.name ? true : false}
            variant="bordered"
            {...register('name', {
              required: 'Обязательное поле',
              minLength: { value: 3, message: 'Минимум 3 символа' },
            })}
          />

          <Controller
            name="dateOfBirth"
            control={control}
            rules={{
              validate: {
                dateOfBirth: value => {
                  if (value) {
                    const date = new Date(value)
                    const now = new Date()
                    if (date > now) {
                      return 'Дата рождения не может быть в будущем'
                    }
                  }
                  return true
                },
                dateOfBirthAge: value => {
                  if (value) {
                    const date = new Date(value)
                    const now = new Date()
                    if (now.getFullYear() - date.getFullYear() > 120) {
                      return 'Дата рождения не может быть больше 120 лет'
                    }
                  }
                  return true
                },
              },
            }}
            render={({ field }) => {
              // Массивы для селектов
              const months = [
                { key: '0', name: 'января' },
                { key: '1', name: 'февраля' },
                { key: '2', name: 'марта' },
                { key: '3', name: 'апреля' },
                { key: '4', name: 'мая' },
                { key: '5', name: 'июня' },
                { key: '6', name: 'июля' },
                { key: '7', name: 'августа' },
                { key: '8', name: 'сентября' },
                { key: '9', name: 'октября' },
                { key: '10', name: 'ноября' },
                { key: '11', name: 'декабря' },
              ]
              const now = new Date()
              const currentYear = now.getFullYear()
              const years = Array.from({ length: 121 }, (_, i) =>
                (currentYear - i).toString()
              )
              // Дни зависят от месяца и года
              const yearNum = Number(Array.from(selectedYear)[0]) || currentYear
              const monthNum = Number(Array.from(selectedMonth)[0]) || 0
              const daysInMonth = new Date(yearNum, monthNum + 1, 0).getDate()
              const days = Array.from({ length: daysInMonth }, (_, i) =>
                (i + 1).toString()
              )

              // Обработчик изменения
              const handleChange = (
                type: 'day' | 'month' | 'year',
                set: Selection
              ) => {
                if (type === 'day') setSelectedDay(set)
                if (type === 'month') setSelectedMonth(set)
                if (type === 'year') setSelectedYear(set)
                const day = Array.from(type === 'day' ? set : selectedDay)[0]
                const month = Array.from(
                  type === 'month' ? set : selectedMonth
                )[0]
                const year = Array.from(type === 'year' ? set : selectedYear)[0]
                if (day && month && year) {
                  const date = new Date(
                    Number(year),
                    Number(month),
                    Number(day)
                  )
                  field.onChange(date.toISOString())
                }
              }
              // Сброс
              const handleClear = () => {
                setSelectedDay(new Set([]))
                setSelectedMonth(new Set([]))
                setSelectedYear(new Set([]))
                field.onChange(null)
              }
              return (
                <div>
                  <div className="mb-1 text-sm font-medium text-foreground">
                    День рождения
                  </div>
                  <div className="flex gap-2 flex-col sm:flex-row">
                    <Select
                      label="День"
                      selectedKeys={selectedDay}
                      onSelectionChange={set => handleChange('day', set)}
                      className="min-w-[90px]"
                      variant="bordered"
                      size="md"
                      placeholder="День"
                    >
                      {days.map(d => (
                        <SelectItem key={d}>{d}</SelectItem>
                      ))}
                    </Select>
                    <Select
                      label="Месяц"
                      selectedKeys={selectedMonth}
                      onSelectionChange={set => handleChange('month', set)}
                      className="min-w-[140px]"
                      variant="bordered"
                      size="md"
                      placeholder="Месяц"
                    >
                      {months.map(m => (
                        <SelectItem key={m.key}>{m.name}</SelectItem>
                      ))}
                    </Select>
                    <Select
                      label="Год"
                      selectedKeys={selectedYear}
                      onSelectionChange={set => handleChange('year', set)}
                      className="min-w-[110px]"
                      variant="bordered"
                      size="md"
                      placeholder="Год"
                    >
                      {years.map(y => (
                        <SelectItem key={y}>{y}</SelectItem>
                      ))}
                    </Select>
                    {field.value && (
                      <div
                        className="flex items-center text-sm text-default-400 cursor-pointer hover:text-default-foreground"
                        onClick={handleClear}
                      >
                        <IoCloseOutline className="text-xl" />
                        <span className="sm:hidden">Очистить дату</span>
                      </div>
                    )}
                  </div>
                  {errors.dateOfBirth?.message && (
                    <div className="text-danger text-xs mt-1">
                      {errors.dateOfBirth.message}
                    </div>
                  )}
                </div>
              )
            }}
          />
          <Controller
            name="bio"
            control={control}
            render={({ field }) => (
              <Textarea
                {...field}
                label="Ваша биография"
                labelPlacement="outside"
                placeholder="Кратко о себе"
                errorMessage={errors.bio?.message || ''}
                isInvalid={errors.bio ? true : false}
                variant="bordered"
                maxRows={10}
              />
            )}
          />
          <Input
            label="Местоположение"
            labelPlacement="outside"
            placeholder='Например: "Москва, Россия"'
            type="text"
            errorMessage={errors.location?.message || ''}
            isInvalid={errors.location ? true : false}
            variant="bordered"
            {...register('location')}
          />
          {error && <Alert color="danger" title={error} />}
          <div className="flex gap-2 justify-end">
            <Button
              fullWidth
              color="primary"
              type="submit"
              isLoading={isLoading}
            >
              Обновить профиль
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  )
}

export default EditProfile
