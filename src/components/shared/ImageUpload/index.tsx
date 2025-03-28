import { useCallback, useState, useEffect } from 'react'
import { FileRejection, useDropzone } from 'react-dropzone'
import { Image } from "@heroui/react"
import { BASE_URL } from '../../../constants'

interface ImageUploadProps {
  onChange: (file: File) => void
  currentImageUrl?: string
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

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (fileRejections.length > 0) {
        fileRejections.forEach(({ errors }) => {
          errors.forEach((error: any) => {
            console.log(error)
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
        onChange(file)
        const previewUrl = URL.createObjectURL(file)
        setPreview(previewUrl)
      }
    },
    [onChange, onError],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
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
    [onDrop, onError],
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
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview)
      }
    }
  }, [preview])

  const displayImage =
    preview ||  (currentImageUrl ? `${currentImageUrl}` : null)

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
            className="object-cover border-4 border-white"
          />
        </div>
      )}
      <div
        {...getRootProps()}
        className={`w-full cursor-pointer rounded-xl border-2 border-dashed p-4 text-center transition-all hover:border-primary ${
          isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300'
        }`}
      >
        <input {...getInputProps()} />
        <div className="py-4">
          <p className="mb-2 text-sm text-gray-500">
            {isDragActive
              ? 'Отпустите файл здесь'
              : 'Перетащите изображение сюда или нажмите для выбора'}
          </p>
          <p className="text-xs text-gray-400">
            Поддерживаются JPG, PNG, GIF или WebP
            <br />
            Можно вставить изображение из буфера обмена (Ctrl+V)
          </p>
        </div>
      </div>
    </div>
  )
}

export default ImageUpload
