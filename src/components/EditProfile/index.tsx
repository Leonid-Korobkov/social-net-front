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
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { User } from '../../app/types'
import { useParams } from 'react-router-dom'
import { useUpdateUserMutation } from '../../app/services/user.api'
import { hasErrorField } from '../../utils/hasErrorField'
import { validateEmailPattern } from '../../utils/validateFieldsForm'
import { IoMdMail } from 'react-icons/io'
import { formatDateToISO } from '../../utils/formatToClientDate'
import { CalendarDate, parseDate } from '@internationalized/date'
import toast from 'react-hot-toast'

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

  const {
    register,
    handleSubmit,
    control,
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files !== null) {
      setSelectedFile(event.target.files[0])
    }
  }

  const onSubmit = async (data: User) => {
    if (id) {
      try {
        const formData = new FormData()
        data.name && formData.append('name', data.name)
        data.email &&
          data.email !== user?.email &&
          formData.append('email', data.email)
        data.dateOfBirth &&
          formData.append(
            'dateOfBirth',
            new Date(data.dateOfBirth).toISOString(),
          )
        data.bio && formData.append('bio', data.bio)
        data.location && formData.append('location', data.location)
        selectedFile &&
          formData.append(
            'avatar',
            new File([selectedFile], `${data.email}_${Date.now()}.png`, {
              type: selectedFile.type,
            }),
          )

        //updateUser({ body: formData, id }).unwrap()
        const promise = updateUser({ body: formData, id }).unwrap()

        const toastId = toast.loading('Сохранение...')

        promise
          .then(() => {
            toast.success('Профиль обновлен!')
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
    <Modal isOpen={isOpen} onClose={onClose} backdrop="blur">
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
                <Input
                  label="Email"
                  type="email"
                  errorMessage={errors.email?.message || ''}
                  isInvalid={errors.email ? true : false}
                  variant="bordered"
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
                  label="Имя"
                  type="text"
                  errorMessage={errors.name?.message || ''}
                  isInvalid={errors.name ? true : false}
                  variant="bordered"
                  {...register('name', {
                    required: 'Обязательное поле',
                    minLength: { value: 3, message: 'Минимум 3 символа' },
                  })}
                />
                <input
                  name="avatarUrl"
                  placeholder="Выберете файл"
                  type="file"
                  onChange={handleFileChange}
                />
                <Controller
                  name="dateOfBirth"
                  control={control}
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
                        value={parsedDate}
                        onChange={date => {
                          if (date) {
                            field.onChange(date.toString()) // Сохраняем строку только если date не null
                          }
                        }}
                        variant="bordered"
                        errorMessage={errors.dateOfBirth?.message || ''}
                        isInvalid={!!errors.dateOfBirth}
                        showMonthAndYearPickers
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
                      placeholder="Кратко о себе"
                      labelPlacement="inside"
                      errorMessage={errors.bio?.message || ''}
                      isInvalid={errors.bio ? true : false}
                      variant="bordered"
                      maxRows={10}
                    />
                  )}
                />
                <Input
                  label="Местоположение"
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
