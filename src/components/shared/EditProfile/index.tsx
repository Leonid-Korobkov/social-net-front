import {
  Alert,
  Button,
  DatePicker,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
} from '@nextui-org/react'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { User } from '../../../app/types'
import { useParams } from 'react-router-dom'
import { useUpdateUserMutation } from '../../../app/services/user.api'
import { hasErrorField } from '../../../utils/hasErrorField'
import { validateEmailPattern } from '../../../utils/validateFieldsForm'
import { IoMdMail } from 'react-icons/io'
import { IoCloseOutline } from 'react-icons/io5'
import { formatDateToISO } from '../../../utils/formatToClientDate'
import { parseDate, getLocalTimeZone, today } from '@internationalized/date'
import toast from 'react-hot-toast'
import ImageUpload from '../ImageUpload'
import { useCloudinaryImage } from '../../../hooks/useCloudinaryImage'

interface IEditProfile {
  isOpen: boolean
  onClose: () => void
  user?: User
}

function EditProfile({
  isOpen = false,
  onClose = () => null,
  user,
}: IEditProfile) {
  const [updateUser, { isLoading }] = useUpdateUserMutation()

  const [error, setError] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const { id } = useParams<{ id: string }>()
  const { getOptimizedUrl } = useCloudinaryImage({
    src: user?.avatarUrl,
  })

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<User>({
    mode: 'onChange',
    reValidateMode: 'onBlur',
    defaultValues: {
      email: user?.email,
      name: user?.name,
      dateOfBirth: user?.dateOfBirth,
      bio: user?.bio,
      location: user?.location,
    },
  })

  useEffect(() => {
    if (user) {
      reset(user)
    }
  }, [user, reset])

  const onSubmit = async (data: User) => {
    if (id) {
      try {
        const formData = new FormData()
        formData.append('name', data.name || '')
        if (data.email !== user?.email) {
          formData.append('email', data.email || '')
        }
        formData.append(
          'dateOfBirth',
          data.dateOfBirth ? new Date(data.dateOfBirth).toISOString() : '',
        )
        formData.append('bio', data.bio || '')
        formData.append('location', data.location || '')
        selectedFile &&
          formData.append(
            'avatar',
            new File([selectedFile], `${data.email}_${Date.now()}.png`, {
              type: selectedFile.type,
            }),
          )

        const promise = updateUser({ body: formData, id }).unwrap()

        const toastId = toast.loading('Сохранение...')

        promise
          .then(() => {
            toast.success('Профиль обновлен!')
            setSelectedFile(null)
          })
          .catch(err => {
            if (hasErrorField(err)) {
              setError(err.data.error)
              toast.error('Не удалось сохранить: ' + err.data.error)
            } else {
              setError('Произошла ошибка при обновлении профиля')
              toast.error('Произошла ошибка при обновлении профиля')
            }
          })
          .finally(() => {
            toast.dismiss(toastId)
          })

        onClose()
      } catch (err) {
        if (hasErrorField(err)) {
          setError(err.data.error)
        }
      }
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} backdrop="blur" placement="top">
      <ModalContent>
        {onClose => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Изменения профиля
            </ModalHeader>
            <ModalBody>
              <form
                className="flex flex-col gap-4"
                onSubmit={handleSubmit(onSubmit)}
              >
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
                    let parsedDate = null
                    if (field.value) {
                      try {
                        parsedDate = parseDate(formatDateToISO(field.value))
                      } catch (error) {
                        console.error('Ошибка парсинга даты:', error)
                      }
                    }

                    return (
                      <DatePicker
                        {...field}
                        label="Дата Рождения"
                        labelPlacement="outside"
                        value={parsedDate}
                        maxValue={today(getLocalTimeZone())}
                        minValue={today(getLocalTimeZone()).subtract({
                          years: 120,
                        })}
                        onChange={date => {
                          if (date) {
                            field.onChange(date.toString())
                          }
                        }}
                        endContent={
                          field.value && (
                            <div className="flex items-center">
                              <IoCloseOutline
                                className="text-xl text-default-400 cursor-pointer hover:text-default-foreground hover:scale-125 transition-transform"
                                onClick={() => field.onChange(null)}
                              />
                            </div>
                          )
                        }
                        variant="bordered"
                        errorMessage={errors.dateOfBirth?.message || ''}
                        isInvalid={errors.dateOfBirth ? true : false}
                        showMonthAndYearPickers
                        selectorButtonPlacement="start"
                        description="Формат даты: ММ.ДД.ГГГГ"
                      />
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
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Закрыть
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

export default EditProfile
