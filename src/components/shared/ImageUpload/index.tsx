'use client'
import { useCallback, useState, useEffect } from 'react'
import { FileRejection, useDropzone } from 'react-dropzone'
import { Button, cn, Image } from '@heroui/react'
import { useGetNewRandomImage, userKeys } from '@/services/api/user.api'
import { FaWandMagicSparkles } from 'react-icons/fa6'
import { IoCloudUploadOutline } from 'react-icons/io5'
import { useQueryClient } from '@tanstack/react-query'
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

interface ImageUploadProps {
  onChange: (file: File | string) => void
  currentImageUrl: string
  className?: string
  onError?: (message: string) => void
}

function ImageUpload({
  onChange,
  currentImageUrl,
  className = '',
  onError = (message: string) => console.error(message),
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [isConverting, setIsConverting] = useState(false)
  const [isShowClearImageBtn, setIsShowClearImageBtn] = useState(false)
  const queryClient = useQueryClient()

  const {
    data: newImageUrl,
    refetch: refetchNewImage,
    isFetching: isLoadingNewImage,
  } = useGetNewRandomImage()

  // Функция для конвертации HEIC в JPEG
  const convertHeicToJpeg = async (file: File): Promise<File> => {
    try {
      setIsConverting(true)
      const jpegBlob = (await heic2any({
        blob: file,
        toType: 'image/jpeg',
        quality: 0.9,
      })) as Blob

      // Создаем новый файл с правильным типом и именем
      return new File([jpegBlob], file.name.replace(/\.heic$/i, '.jpg'), {
        type: 'image/jpeg',
      })
    } catch (error) {
      console.error('Ошибка при конвертации HEIC в JPEG:', error)
      throw error
    } finally {
      setIsConverting(false)
    }
  }

  const onDrop = useCallback(
    async (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (fileRejections.length > 0) {
        fileRejections.forEach(({ errors }) => {
          errors.forEach((error: { code: string; message: string }) => {
            switch (error.code) {
              case 'too-many-files':
                onError('Можно загрузить только один файл')
                break
              case 'file-invalid-type':
                onError('Неподдерживаемый формат файла')
                break
              default:
                onError(`Ошибка загрузки: ${error.message}`)
            }
          })
        })
        return
      }

      if (acceptedFiles?.length) {
        const file = acceptedFiles[0]
        if (file.size > 10 * 1024 * 1024) {
          onError('Размер файла не должен превышать 10MB')
          return
        }

        // Проверяем, является ли файл HEIC
        const isHeic =
          file.type === 'image/heic' ||
          file.name.toLowerCase().endsWith('.heic')

        try {
          // Быстро создаем превью для всех типов файлов
          const previewUrl = URL.createObjectURL(file)
          setPreview(previewUrl)

          if (isHeic) {
            // Если это HEIC, конвертируем после установки начального превью
            const jpegFile = await convertHeicToJpeg(file)
            onChange(jpegFile)

            // Обновляем превью на более качественное после конвертации
            const jpegPreviewUrl = URL.createObjectURL(jpegFile)
            setPreview(jpegPreviewUrl)

            // Отзываем старое превью
            URL.revokeObjectURL(previewUrl)
          } else {
            onChange(file)
          }
        } catch (error) {
          onError(
            `Ошибка обработки файла: ${
              error instanceof Error ? error.message : String(error)
            }`
          )
        }
      }
    },
    [onChange, onError]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp', '.heic'],
    },
    maxFiles: 1,
    multiple: false,
    onError: (error: Error) => {
      onError(`Произошла ошибка: ${error.message}`)
    },
  })

  // Обработка вставки изображения
  const handlePaste = useCallback(
    (e: ClipboardEvent) => {
      const items = e.clipboardData?.items
      if (items) {
        let imageFound = false
        for (let i = 0; i < items.length; i++) {
          if (items[i].type.indexOf('image') !== -1) {
            const file = items[i].getAsFile()
            if (file) {
              imageFound = true
              onDrop([file], [])
            }
            break
          }
        }
        if (!imageFound) {
          onError('В буфере обмена не найдено изображение')
        }
      }
    },
    [onDrop, onError]
  )

  // Добавляем обработчик вставки при монтировании и удаляем при размонтировании
  useEffect(() => {
    document.addEventListener('paste', handlePaste)
    return () => {
      document.removeEventListener('paste', handlePaste)
    }
  }, [handlePaste])

  // Очистка URL при размонтировании компонента
  useEffect(() => {
    // Получаем QueryCache из QueryClient
    const queryCache = queryClient.getQueryCache()
    // Ищем запрос по ключу
    const query = queryCache.find({ queryKey: userKeys.randomImage })
    // Удаляем запрос из кэша
    if (query) {
      setIsShowClearImageBtn(true)
    }
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview)
      }
    }
  }, [preview])

  useEffect(() => {
    if (newImageUrl) {
      setPreview(newImageUrl)
      onChange(newImageUrl)
    }
  }, [newImageUrl])

  const displayImage =
    preview || (currentImageUrl ? `${currentImageUrl}` : null)

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      {displayImage && (
        <div className="w-full h-full flex justify-center">
          <Image
            src={displayImage}
            alt="Preview"
            width={200}
            height={200}
            // isBlurred
            className="object-cover"
          />
        </div>
      )}
      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors',
          'flex flex-col items-center justify-center min-h-[100px]',
          isDragActive
            ? 'border-primary bg-primary/5'
            : 'border-default-300 hover:border-primary'
        )}
      >
        <input {...getInputProps()} />
        <div className="py-4 flex flex-col items-center justify-center">
          <IoCloudUploadOutline className="text-3xl mb-2" />
          <p className="text-sm">
            {isDragActive
              ? 'Отпустите файл здесь'
              : isConverting
              ? 'Конвертация HEIC...'
              : 'Перетащите файл сюда или кликните для выбора или вставьте из буфера обмена (Ctrl+V)'}
          </p>
          <p className="text-xs text-default-400 mt-1">
            Поддерживаются изображения (JPG, PNG, GIF, WebP, HEIC)
          </p>
        </div>
      </div>
      <Button
        fullWidth
        color="default"
        type="button"
        className="whitespace-normal h-auto py-2"
        startContent={<FaWandMagicSparkles />}
        isLoading={isLoadingNewImage}
        onClick={async () => {
          setIsShowClearImageBtn(true)
          await refetchNewImage()
        }}
      >
        Сгенерировать случайное изображение
      </Button>
      <Button
        size="sm"
        variant="bordered"
        onClick={() => {
          setIsShowClearImageBtn(false)
          setPreview(currentImageUrl)
          onChange(currentImageUrl)
          // Получаем QueryCache из QueryClient
          const queryCache = queryClient.getQueryCache()
          // Ищем запрос по ключу
          const query = queryCache.find({ queryKey: userKeys.randomImage })
          // Удаляем запрос из кэша
          if (query) {
            queryCache.remove(query)
          }
        }}
        className={cn(
          'whitespace-normal h-auto py-2',
          !isShowClearImageBtn && 'hidden'
        )}
      >
        Вернуть предыдущее изображение
      </Button>
    </div>
  )
}
export default ImageUpload
