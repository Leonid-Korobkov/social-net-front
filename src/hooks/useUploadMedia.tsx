import { useState, useCallback, useEffect, useRef } from 'react'
import toast from 'react-hot-toast'
import { MediaItem, MediaType } from '@/store/types'
import { apiClient, handleAxiosError } from '@/services/ApiConfig'
import { AxiosError } from 'axios'
import {
  useCloudinaryUpload,
  useCloudinaryChunkedUpload,
} from '@/services/api/cloudinary.api'
import { useStore } from 'zustand'
import {
  UserSettingsStore,
  UploadStatus,
  StorableUpload,
  uploadToStorable,
} from '@/store/userSettings.store'

// Импорт heic2any только на клиенте
let heic2any: any = null
if (typeof window !== 'undefined') {
  // Динамический импорт для клиентской стороны
  import('heic2any')
    .then(module => {
      heic2any = module.default
    })
    .catch(error => {
      console.error('Ошибка при загрузке heic2any:', error)
    })
}

const MAX_IMAGE_FILE_SIZE = 10 * 1024 * 1024 // 10 МБ
const MAX_VIDEO_FILE_SIZE = 100 * 1024 * 1024 // 100 МБ
const MAX_FILES = 10 // Максимальное количество файлов
const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/heic',
]
const ALLOWED_VIDEO_TYPES = [
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'video/mov',
]

interface UseUploadMediaOptions {
  maxFiles?: number
  onSuccess?: (urls: string[]) => void
  onError?: (error: string) => void
}

// Функция для определения браузера Safari
const isSafari = () => {
  if (typeof window === 'undefined') return false
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
  return isSafari
}

// Вспомогательная функция для создания превью URL
const createPreviewUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Для видео файлов используем специальный метод
    if (ALLOWED_VIDEO_TYPES.includes(file.type)) {
      createVideoThumbnail(file)
        .then(thumbnailUrl => {
          resolve(thumbnailUrl)
        })
        .catch(error => {
          console.error('Ошибка при создании превью видео:', error)
          // В случае ошибки все равно возвращаем data URL для видео
          const reader = new FileReader()
          reader.onload = event => {
            if (event.target?.result) {
              resolve(event.target.result as string)
            } else {
              reject(new Error('Ошибка чтения видео файла'))
            }
          }
          reader.onerror = error => {
            reject(error)
          }
          reader.readAsDataURL(file)
        })
      return
    }

    // Для HEIC файлов проверяем браузер
    if (
      file.type === 'image/heic' ||
      file.name.toLowerCase().endsWith('.heic')
    ) {
      // Если Safari, используем нативную поддержку HEIC
      if (isSafari()) {
        const reader = new FileReader()
        reader.onload = event => {
          if (event.target?.result) {
            resolve(event.target.result as string)
          } else {
            reject(new Error('Ошибка чтения HEIC файла в Safari'))
          }
        }
        reader.onerror = error => {
          reject(error)
        }
        reader.readAsDataURL(file)
      } else {
        // Сразу возвращаем заглушку для быстрого отображения UI
        // и запускаем конвертацию в фоне
        resolve(
          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%23eeeeee'/%3E%3C/svg%3E"
        )

        // Проверка доступности heic2any
        if (!heic2any) {
          console.error('heic2any не загружен')
          return
        }

        // Начинаем конвертацию в фоновом режиме
        convertHeicToJpeg(file)
          .then(jpegBlob => {
            const reader = new FileReader()
            reader.onload = event => {
              if (event.target?.result) {
                // Здесь можно обновить изображение в UI через внешний callback
                // Но текущая структура не позволяет это сделать прямо из этой функции
                // Поэтому будем использовать исходную заглушку
              }
            }
            reader.readAsDataURL(jpegBlob)
          })
          .catch(error => {
            console.error(`Ошибка конвертации HEIC: ${error.message}`)
          })
      }
    } else {
      const reader = new FileReader()
      reader.onload = event => {
        if (event.target?.result) {
          const dataUrl = event.target.result as string
          resolve(dataUrl)
        } else {
          reject(new Error('Ошибка чтения файла'))
        }
      }
      reader.onerror = error => {
        reject(error)
      }
      reader.readAsDataURL(file)
    }
  })
}

// Функция для создания превью (эскиза) из видео файла
const createVideoThumbnail = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Создаем элемент video для загрузки видеофайла
    const video = document.createElement('video')
    video.preload = 'metadata'
    video.playsInline = true
    video.muted = true

    // URL для видеофайла
    const fileUrl = URL.createObjectURL(file)
    video.src = fileUrl

    // Обработчик ошибки загрузки видео
    video.onerror = () => {
      URL.revokeObjectURL(fileUrl)
      reject(new Error('Ошибка загрузки видео'))
    }

    // Когда метаданные загружены, можно взять первый кадр
    video.onloadedmetadata = () => {
      // Перемещаемся на 1 секунду или на середину видео (что меньше)
      video.currentTime = Math.min(1, video.duration / 2)
    }

    // Когда видео перемотано до нужного момента
    video.onseeked = () => {
      // Создаем canvas для рендеринга кадра
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      if (!ctx) {
        URL.revokeObjectURL(fileUrl)
        reject(new Error('Не удалось создать контекст canvas'))
        return
      }

      // Задаем размер canvas по размеру видео (но не больше определенного значения)
      const maxSize = 400
      const width = Math.min(video.videoWidth, maxSize)
      const height = Math.min(video.videoHeight, maxSize)

      // Сохраняем пропорции
      const ratio = Math.min(
        width / video.videoWidth,
        height / video.videoHeight
      )
      canvas.width = video.videoWidth * ratio
      canvas.height = video.videoHeight * ratio

      // Рисуем кадр из видео на canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

      // Получаем data URL из canvas
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8)

      // Очищаем ресурсы
      URL.revokeObjectURL(fileUrl)

      resolve(dataUrl)
    }
  })
}

// Функция для конвертации HEIC в JPEG
const convertHeicToJpeg = async (file: File): Promise<Blob> => {
  try {
    if (!heic2any) {
      throw new Error('heic2any не загружен')
    }

    const jpegBlob = (await heic2any({
      blob: file,
      toType: 'image/jpeg',
      quality: 0.9,
    })) as Blob

    return jpegBlob
  } catch (error) {
    console.error('Ошибка при конвертации HEIC в JPEG:', error)
    throw error
  }
}

// Функция для подготовки файла перед загрузкой
const prepareFileForUpload = async (file: File): Promise<File> => {
  // Если это HEIC файл и браузер не Safari, конвертируем его в JPEG
  if (
    (file.type === 'image/heic' || file.name.toLowerCase().endsWith('.heic')) &&
    !isSafari()
  ) {
    try {
      const jpegBlob = await convertHeicToJpeg(file)
      // Создаем новый файл с правильным типом и именем
      const jpegFile = new File(
        [jpegBlob],
        file.name.replace(/\.heic$/i, '.jpg'),
        { type: 'image/jpeg' }
      )
      return jpegFile
    } catch (error) {
      console.error('Ошибка при подготовке HEIC файла:', error)
      throw error
    }
  }

  // Для Safari и других типов файлов просто возвращаем исходный файл
  return file
}

export const useUploadMedia = (options: UseUploadMediaOptions = {}) => {
  const { maxFiles = MAX_FILES, onSuccess, onError } = options

  // Получаем данные из Zustand и их преобразуем в рабочий формат
  const mediaUploadsStore = useStore(
    UserSettingsStore,
    state => state.mediaUploads
  )
  const setMediaUploadsStore = useStore(
    UserSettingsStore,
    state => state.setMediaUploads
  )

  // Локальное состояние для работы с файлами
  const [uploads, setUploads] = useState<UploadStatus[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const initialLoadRef = useRef(false) // Флаг для отслеживания начальной загрузки

  // Получить все успешно загруженные URL
  const getUploadedUrls = useCallback(() => {
    return uploads
      .filter(upload => upload.status === 'success' && upload.url)
      .map(upload => upload.url as string)
  }, [uploads])

  // Инициализация данных после загрузки из localStorage
  useEffect(() => {
    if (mediaUploadsStore.length > 0 && !initialLoadRef.current) {
      const storedData = mediaUploadsStore
        .filter(upload => upload.status === 'success' && upload.url)
        .map(storable => {
          // Создаем более реалистичный File объект с сохраненным размером
          const emptyFile = new File(
            [new ArrayBuffer(storable.fileSize || 0)], // Создаем буфер правильного размера
            storable.fileName || 'file',
            { type: storable.fileType }
          )

          return {
            id: storable.id,
            file: emptyFile,
            progress: 100,
            status: 'success' as const,
            url: storable.url,
            error: storable.error,
            type: storable.type,
          }
        })

      if (storedData.length > 0) {
        setUploads(storedData)
        initialLoadRef.current = true // Отмечаем, что начальная загрузка выполнена
      }
    }
  }, [])

  // Синхронизация с Zustand: сохраняем только успешные медиа-загрузки
  useEffect(() => {
    // Пропускаем первый рендер (при пустом uploads)
    if (uploads.length === 0) return

    // Передаем в хранилище только успешно загруженные файлы
    const successUploads = uploads
      .filter(upload => upload.status === 'success' && upload.url)
      .map(uploadToStorable)

    if (successUploads.length > 0) {
      setMediaUploadsStore(successUploads)
    }
  }, [uploads, setMediaUploadsStore])

  // Используем мутации для Cloudinary
  const { mutateAsync: uploadToCloudinary } = useCloudinaryUpload()
  const { mutateAsync: uploadToCloudinaryChunked } =
    useCloudinaryChunkedUpload()

  // Функция для загрузки файла напрямую из объекта
  const uploadFileDirectly = useCallback(
    async (upload: UploadStatus) => {
      // Запоминаем текущий URL превью
      const currentPreviewUrl = upload.url

      // Обновляем статус на "uploading", сохраняем текущий URL превью
      setUploads(prev => {
        const updated = prev.map(u =>
          u.id === upload.id
            ? {
                ...u,
                status: 'uploading' as const,
                progress: 1,
                // Важно: сохраняем существующий URL для превью
                url: currentPreviewUrl,
              }
            : u
        )

        return updated
      })

      try {
        // Подготавливаем файл перед загрузкой (конвертируем HEIC в JPEG если необходимо)
        const preparedFile = await prepareFileForUpload(upload.file)

        // Выбираем метод загрузки в зависимости от размера файла
        const uploadMethod =
          preparedFile.size > 80 * 1024 * 1024
            ? uploadToCloudinaryChunked
            : uploadToCloudinary

        // Загружаем файл в Cloudinary
        const response = await uploadMethod({
          file: preparedFile,
          onProgress: progress => {
            setUploads(prev =>
              prev.map(u => (u.id === upload.id ? { ...u, progress } : u))
            )
          },
        })

        // Получаем URL из ответа
        const mediaUrl = response.secure_url

        if (!mediaUrl) {
          console.error('Не удалось извлечь URL из ответа:', response)
          throw new Error('Сервер вернул пустой URL')
        }

        // Успешная загрузка - обновляем локальное состояние
        setUploads(prev => {
          const updatedUploads = prev.map(u =>
            u.id === upload.id
              ? {
                  ...u,
                  status: 'success' as const,
                  url: mediaUrl,
                  progress: 100,
                }
              : u
          )

          // После обновления локального состояния
          setTimeout(() => {
            // Получаем успешно загруженные URL для колбэка
            const successUrls = updatedUploads
              .filter(u => u.status === 'success' && u.url)
              .map(u => u.url!)

            if (onSuccess && successUrls.length > 0) {
              onSuccess(successUrls)
            }
          }, 0)

          return updatedUploads
        })
      } catch (error) {
        console.error('Ошибка загрузки файла:', error)
        const errorMessage =
          error instanceof Error ? error.message : 'Ошибка загрузки файла'

        // Обновляем статус на "error"
        setUploads(prev =>
          prev.map(u =>
            u.id === upload.id
              ? { ...u, status: 'error' as const, error: errorMessage }
              : u
          )
        )

        if (onError) {
          onError(errorMessage)
        }

        toast.error(errorMessage)
      }
    },
    [
      uploads,
      onSuccess,
      onError,
      uploadToCloudinary,
      uploadToCloudinaryChunked,
      getUploadedUrls,
    ]
  )

  // Обработчик добавления файлов
  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      if (uploads.length >= maxFiles) {
        toast.error(`Максимум ${maxFiles} файлов`)
        return
      }

      if (!files || files.length === 0) {
        toast.error('Файлы не выбраны')
        return
      }

      const newFiles = Array.from(files).slice(0, maxFiles - uploads.length)
      const newUploads: UploadStatus[] = []

      // Создаем превью для всех файлов асинхронно
      for (const file of newFiles) {
        // Проверка типа файла
        if (
          !ALLOWED_IMAGE_TYPES.includes(file.type) &&
          !ALLOWED_VIDEO_TYPES.includes(file.type)
        ) {
          toast.error(`Тип файла не поддерживается: ${file.type}`)
          continue
        }

        const fileType = ALLOWED_IMAGE_TYPES.includes(file.type)
          ? MediaType.IMAGE
          : MediaType.VIDEO

        if (fileType == MediaType.IMAGE) {
          // Проверка размера файла
          if (file.size > MAX_IMAGE_FILE_SIZE) {
            toast.error(
              `Файл слишком большой: ${(file.size / (1024 * 1024)).toFixed(
                2
              )} МБ > ${MAX_IMAGE_FILE_SIZE} МБ`
            )
            continue
          }
        } else {
          if (file.size > MAX_VIDEO_FILE_SIZE) {
            toast.error(
              `Файл слишком большой: ${(file.size / (1024 * 1024)).toFixed(
                2
              )} МБ > ${(MAX_VIDEO_FILE_SIZE / (1024 * 1024)).toFixed(2)} МБ`
            )
            continue
          }
        }

        try {
          // Создаем превью с помощью FileReader
          const previewUrl = await createPreviewUrl(file)

          // Добавляем в новые загрузки
          const newUpload: UploadStatus = {
            id: Math.random().toString(36).substring(2),
            file,
            progress: 0,
            status: 'pending',
            type: fileType,
            url: previewUrl, // Для превью используем data URL или заглушку для HEIC
          }

          // Если это HEIC в не-Safari, запускаем асинхронное обновление превью
          if (
            (file.type === 'image/heic' ||
              file.name.toLowerCase().endsWith('.heic')) &&
            !isSafari()
          ) {
            // Запускаем конвертацию для получения реального превью
            convertHeicToJpeg(file)
              .then(jpegBlob => {
                const reader = new FileReader()
                reader.onload = event => {
                  if (event.target?.result) {
                    // Обновляем превью после конвертации
                    setUploads(prev =>
                      prev.map(u =>
                        u.id === newUpload.id
                          ? { ...u, url: event.target!.result as string }
                          : u
                      )
                    )
                  }
                }
                reader.readAsDataURL(jpegBlob)
              })
              .catch(console.error)
          }

          newUploads.push(newUpload)
        } catch (error) {
          toast.error(`Не удалось создать превью для файла ${file.name}`)
        }
      }

      if (newUploads.length === 0) {
        return // Не добавляем пустой массив
      }

      // Одноразовый флаг для предотвращения дублирования загрузки
      const uploadedFiles = new Set<string>()

      // Обновляем локальное состояние и выводим новые загрузки для диагностики
      setUploads(prev => {
        const updatedUploads = [...prev, ...newUploads]

        // Используем setTimeout для асинхронной загрузки после обновления состояния
        setTimeout(() => {
          newUploads.forEach(upload => {
            uploadFileDirectly(upload)
          })
        }, 0)

        return updatedUploads
      })
    },
    [uploads, maxFiles, uploadFileDirectly]
  )

  // Функция для загрузки файла по ID (используется для повторной загрузки)
  const uploadFile = useCallback(
    async (uploadId: string) => {
      // Находим файл в текущем состоянии
      const upload = uploads.find(u => u.id === uploadId)

      if (!upload) {
        console.error('Файл не найден для загрузки:', uploadId)
        return
      }

      // Используем общую функцию для загрузки
      await uploadFileDirectly(upload)
    },
    [uploads, uploadFileDirectly]
  )

  // Загрузить все файлы
  const uploadAll = useCallback(() => {
    uploads
      .filter(upload => upload.status === 'pending')
      .forEach(upload => uploadFileDirectly(upload))
  }, [uploads, uploadFileDirectly])

  // Удалить файл из списка и с сервера
  const removeFile = useCallback(
    async (id: string) => {
      const uploadToRemove = uploads.find(u => u.id === id)
      if (!uploadToRemove) return

      // Обновляем статус на removing
      setUploads(prev =>
        prev.map(u => (u.id === id ? { ...u, status: 'removing' } : u))
      )

      try {
        // Если это предварительный URL (blob), освобождаем его
        if (uploadToRemove.url?.startsWith('blob:')) {
          URL.revokeObjectURL(uploadToRemove.url)
        } else if (uploadToRemove.url) {
          // Иначе удаляем с сервера
          await apiClient.delete('/media/delete', {
            data: { url: uploadToRemove.url },
          })
        }
      } catch (error) {
        console.error('Ошибка при удалении файла:', error)
        toast.error('Не удалось удалить файл с сервера')
      }

      // Удаляем файл из локального состояния
      setUploads(prev => prev.filter(u => u.id !== id))

      // Синхронизируем с Zustand (будет вызвано через useEffect)
    },
    [uploads]
  )

  // Очистить все файлы
  const clearAll = useCallback(async () => {
    // Обновляем статус на removing
    setUploads(prev => prev.map(u => ({ ...u, status: 'removing' })))

    // Сначала удаляем файлы с сервера
    const deletePromises = uploads
      .filter(upload => upload.url)
      .map(upload => {
        // Очищаем объекты URL для предотвращения утечек памяти
        if (upload.url && upload.url.startsWith('blob:')) {
          URL.revokeObjectURL(upload.url)
        }
        return apiClient.delete('/media/delete', {
          data: { url: upload.url },
        })
      })

    await Promise.all(deletePromises).catch(error => {
      console.error('Ошибка при удалении файлов:', error)
    })

    // Очищаем состояние
    setUploads([])

    // Очищаем Zustand хранилище
    setMediaUploadsStore([])
  }, [uploads, setMediaUploadsStore])

  // Обработчики событий перетаскивания
  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files)
      }
    },
    [handleFiles]
  )

  // Обработчик клика на зону для выбора файлов
  const handleClickUpload = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }, [])

  // Обработчик изменения input-файла
  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        handleFiles(e.target.files)
        // Сбрасываем value для возможности повторной загрузки того же файла
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      }
    },
    [handleFiles]
  )

  // Обработчик вставки изображений из буфера обмена
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (e.clipboardData && e.clipboardData.files.length > 0) {
        e.preventDefault()
        handleFiles(e.clipboardData.files)
      }
    }

    window.addEventListener('paste', handlePaste)
    return () => {
      window.removeEventListener('paste', handlePaste)
      // Очищаем все blob URL при размонтировании компонента
      uploads.forEach(upload => {
        if (upload.url && upload.url.startsWith('blob:')) {
          URL.revokeObjectURL(upload.url)
        }
      })
    }
  }, [handleFiles, uploads])

  // Классифицировать медиа в список изображений и видео
  const getMediaItems = useCallback((): MediaItem[] => {
    return uploads
      .filter(upload => upload.status === 'success' && upload.url)
      .map(upload => ({
        url: upload.url as string,
        type: upload.type,
        thumbnail: upload.type === MediaType.VIDEO ? upload.url : undefined,
      }))
  }, [uploads])

  // Проверка статуса загрузок
  const isLoading = uploads.some(upload => upload.status === 'uploading')
  const hasError = uploads.some(upload => upload.status === 'error')
  const isComplete = uploads.every(
    upload => upload.status === 'success' || upload.status === 'error'
  )

  return {
    uploads,
    isDragging,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    handleClickUpload,
    handleFileInputChange,
    fileInputRef,
    uploadFile,
    uploadAll,
    removeFile,
    clearAll,
    getUploadedUrls,
    isLoading,
    hasError,
    isComplete,
    getMediaItems,
  }
}
