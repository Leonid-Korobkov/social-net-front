import { useMutation } from '@tanstack/react-query'
import {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_UPLOAD_PRESET,
} from '@/app/constants'

// Константы для Cloudinary
const CLOUD_NAME = CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = CLOUDINARY_UPLOAD_PRESET

export interface CloudinaryUploadResponse {
  public_id: string
  version: number
  signature: string
  width: number
  height: number
  format: string
  resource_type: string
  created_at: string
  bytes: number
  type: string
  url: string
  secure_url: string
}

// Хук для загрузки файла в Cloudinary
export const useCloudinaryUpload = () => {
  return useMutation({
    mutationFn: async ({
      file,
      onProgress,
    }: {
      file: File
      onProgress?: (progress: number) => void
    }) => {
      try {
        // Создаем FormData для отправки
        const formData = new FormData()
        formData.append('file', file)
        formData.append('upload_preset', UPLOAD_PRESET)

        // Используем fetch с поддержкой отслеживания прогресса через XMLHttpRequest
        return new Promise<CloudinaryUploadResponse>((resolve, reject) => {
          const xhr = new XMLHttpRequest()
          xhr.open(
            'POST',
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`
          )

          // Отслеживаем прогресс загрузки
          if (onProgress) {
            xhr.upload.onprogress = event => {
              if (event.lengthComputable) {
                const progress = Math.round((event.loaded * 100) / event.total)
                onProgress(progress)
              }
            }
          }

          // Обработка ответа
          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              const response = JSON.parse(xhr.responseText)
              resolve(response)
            } else {
              reject(new Error(`Ошибка загрузки: ${xhr.statusText}`))
            }
          }

          // Обработка ошибки
          xhr.onerror = () => {
            reject(new Error('Ошибка сети при загрузке файла'))
          }

          // Отправка запроса
          xhr.send(formData)
        })
      } catch (error) {
        console.error('Ошибка при загрузке файла в Cloudinary:', error)
        throw error
      }
    },
  })
}

// Хук для chunked upload (для больших файлов)
export const useCloudinaryChunkedUpload = () => {
  return useMutation({
    mutationFn: async ({
      file,
      onProgress,
    }: {
      file: File
      onProgress?: (progress: number) => void
    }) => {
      if (!file) {
        throw new Error('Файл не выбран')
      }

      const uniqueUploadId = `upload_${Date.now()}`
      const chunkSize = 2 * 1024 * 1024 // 1MB
      const totalChunks = Math.ceil(file.size / chunkSize)
      let currentChunk = 0
      let totalProgress = 0

      return new Promise<CloudinaryUploadResponse>((resolve, reject) => {
        // Функция для загрузки чанка
        const uploadChunk = async (start: number, end: number) => {
          const chunk = file.slice(start, end)
          const formData = new FormData()
          formData.append('file', chunk)
          formData.append('cloud_name', CLOUD_NAME)
          formData.append('upload_preset', UPLOAD_PRESET)

          const contentRange = `bytes ${start}-${end - 1}/${file.size}`

          try {
            const response = await fetch(
              `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,
              {
                method: 'POST',
                body: formData,
                headers: {
                  'X-Unique-Upload-Id': uniqueUploadId,
                  'Content-Range': contentRange,
                },
              }
            )

            if (!response.ok) {
              throw new Error('Ошибка загрузки чанка')
            }

            currentChunk++
            const chunkProgress = (1 / totalChunks) * 100
            totalProgress += chunkProgress

            if (onProgress) {
              onProgress(Math.min(99, totalProgress)) // Не доходим до 100%, пока не окончена загрузка
            }

            if (currentChunk < totalChunks) {
              const nextStart = currentChunk * chunkSize
              const nextEnd = Math.min(nextStart + chunkSize, file.size)
              await uploadChunk(nextStart, nextEnd)
            } else {
              // Последний чанк загружен, получаем результат
              const result = await response.json()
              if (onProgress) {
                onProgress(100)
              }
              resolve(result)
            }
          } catch (error) {
            reject(error)
          }
        }

        // Начинаем загрузку с первого чанка
        const start = 0
        const end = Math.min(chunkSize, file.size)
        uploadChunk(start, end).catch(reject)
      })
    },
  })
}
