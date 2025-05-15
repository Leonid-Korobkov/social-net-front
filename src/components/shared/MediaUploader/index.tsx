'use client'

import { useUploadMedia } from '@/hooks/useUploadMedia'
import { Badge, Button, Progress, Spinner, cn } from '@heroui/react'
import { useCallback, useState } from 'react'
import {
  IoCloudUploadOutline,
  IoImage,
  IoTrash,
  IoWarning,
  IoReload,
} from 'react-icons/io5'
import { FaFileDownload } from 'react-icons/fa'
import { IoIosCloudDone } from 'react-icons/io'
import { FaRegFileVideo } from 'react-icons/fa'

// Функция для форматирования размера файла
const formatFileSize = (size: number): string => {
  if (size < 1024) {
    return `${size} B`
  } else if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`
  } else {
    return `${(size / (1024 * 1024)).toFixed(1)} MB`
  }
}

interface MediaUploaderProps {
  onMediaChange: (urls: string[]) => void
  className?: string
  maxFiles?: number
}

export default function MediaUploader({
  onMediaChange,
  className,
  maxFiles = 10,
}: MediaUploaderProps) {
  const {
    uploads,
    isDragging,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    handleClickUpload,
    handleFileInputChange,
    fileInputRef,
    removeFile,
    clearAll,
    getUploadedUrls,
    isLoading,
  } = useUploadMedia({
    maxFiles,
    onSuccess: urls => {
      if (urls && urls.length > 0) {
        onMediaChange(urls)
      }
    },
  })

  // Удаление медиафайла
  const handleRemove = useCallback(
    async (id: string) => {
      // Удаляем файл (это асинхронная операция, которая также удаляет файл с сервера)
      await removeFile(id)

      // После удаления получаем обновленный список URL
      // Важно здесь использовать getUploadedUrls() а не фильтровать currentUrls,
      // чтобы получить актуальное состояние после удаления
      const remainingUrls = getUploadedUrls()
      console.log('После удаления остались URLs:', remainingUrls)

      // Обновляем родительский компонент с новым списком URL
      // Это уменьшит счетчик прикрепленных файлов в родительском компоненте
      onMediaChange(remainingUrls)
    },
    [removeFile, getUploadedUrls, onMediaChange]
  )

  return (
    <div className={cn('flex flex-col gap-2 w-full', className)}>
      {/* Dropzone */}
      <div
        className={cn(
          'border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors',
          'flex flex-col items-center justify-center min-h-[100px]',
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-default-300 hover:border-primary'
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClickUpload}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*, video/*"
          className="hidden"
          onChange={handleFileInputChange}
        />
        <IoCloudUploadOutline className="text-3xl mb-2" />
        <p className="text-sm">Перетащите файлы сюда или кликните для выбора</p>
        <p className="text-xs text-default-400 mt-1">
          Поддерживаются изображения (JPG, PNG, GIF, WebP, HEIC) и видео (MP4,
          WebM)
        </p>
      </div>

      {/* Preview List */}
      {uploads.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-2">
          {uploads.map(upload => (
            <div
              key={upload.id}
              className="relative rounded-lg border border-default-200 overflow-hidden group"
            >
              {/* Thumbnail or Preview */}
              <div className="aspect-square bg-default-100 relative">
                {upload.status === 'error' ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-danger/10">
                    <IoWarning className="text-danger text-4xl" />
                  </div>
                ) : upload.type === 'image' ? (
                  upload.url ? (
                    <div className="relative w-full h-full">
                      <img
                        src={upload.url}
                        alt="Превью загруженного изображения"
                        className="w-full h-full object-cover"
                      />
                      {/* Полупрозрачное затемнение на время загрузки */}
                      {upload.status === 'uploading' && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center"></div>
                      )}
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <IoImage className="text-4xl text-default-300" />
                    </div>
                  )
                ) : (
                  <div className="w-full h-full flex items-center justify-center relative">
                    {upload.url ? (
                      <>
                        <video
                          key={upload.id}
                          src={upload.url}
                          className="w-full h-full object-cover"
                          preload="metadata"
                          muted
                        />
                        {/* Полупрозрачное затемнение на время загрузки */}
                        {upload.status === 'uploading' && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center"></div>
                        )}
                      </>
                    ) : (
                      <FaRegFileVideo className="text-4xl text-default-300" />
                    )}
                  </div>
                )}

                {/* Status Badge */}
                <div className="absolute top-2 right-2">
                  {upload.status === 'uploading' ? null : upload.status ===
                    'success' ? (
                    <IoIosCloudDone className="mr-1" />
                  ) : upload.status === 'error' ? (
                    <IoWarning className="mr-1" />
                  ) : (
                    <IoReload className="mr-1" />
                  )}
                </div>

                {/* Progress bar */}
                {upload.status === 'uploading' && (
                  <>
                    <Progress
                      value={upload.progress}
                      className="absolute bottom-0 left-0 right-0 h-1"
                      size="sm"
                      color="primary"
                      aria-label={`Прогресс загрузки файла ${upload.file.name}`}
                      showValueLabel={false}
                    />
                    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center">
                      <Spinner size="sm" color="white" className="mb-1" />
                      <div className="text-white text-xs text-center">
                        <div className="font-semibold">{upload.progress}%</div>
                        {upload.file.size !== undefined && (
                          <div className="text-[10px] opacity-80">
                            {formatFileSize(
                              (upload.file.size * upload.progress) / 100
                            )}
                            / {formatFileSize(upload.file.size)}
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
                {/* Actions */}

                {/* Кнопка удаления для десктопных устройств (видна только при наведении) */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hoverDevice:block touchDevice:hidden">
                  <Button
                    isIconOnly
                    color="danger"
                    variant="flat"
                    size="sm"
                    onClick={e => {
                      // e.stopPropagation()
                      handleRemove(upload.id)
                    }}
                  >
                    <IoTrash />
                  </Button>
                </div>

                {/* Кнопка удаления для мобильных устройств (всегда видимая) */}
                <div className="absolute top-2 left-2 touchDevice:block hoverDevice:hidden">
                  <Button
                    isIconOnly
                    color="danger"
                    variant="solid"
                    size="sm"
                    className="bg-danger/90 backdrop-blur-sm shadow-md"
                    onClick={e => {
                      // e.stopPropagation()
                      handleRemove(upload.id)
                    }}
                  >
                    <IoTrash size={16} />
                  </Button>
                </div>

                {upload.status === 'removing' && (
                  <div className="absolute inset-0 bg-black/40 transition-opacity flex items-center justify-center">
                    <Button
                      isIconOnly
                      isLoading
                      color="danger"
                      variant="flat"
                      size="sm"
                      onClick={e => {
                        // e.stopPropagation()
                        handleRemove(upload.id)
                      }}
                    >
                      <IoTrash />
                    </Button>
                  </div>
                )}
              </div>

              {/* File name and size */}
              <div className="p-1 text-center">
                <p className="text-xs truncate px-1">{upload.file.name}</p>
                <div className="flex items-center text-[10px] text-default-400 p-1 gap-1">
                  <FaFileDownload />
                  {upload.file.size === 0
                    ? 'Загружено из кэша'
                    : formatFileSize(upload.file.size)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Control buttons */}
      {uploads.length > 0 && (
        <div className="flex justify-between gap-2 mt-2">
          <div className="text-xs mt-1 text-success">
            Прикреплено медиафайлов: {uploads.length}
          </div>

          <Button
            size="sm"
            color="danger"
            variant="flat"
            onClick={async e => {
              // e.stopPropagation()

              // Очищаем все файлы (включая удаление с сервера)
              await clearAll()

              // Гарантированно обнуляем счетчик в родительском компоненте
              onMediaChange([])
            }}
            isDisabled={isLoading}
          >
            Очистить все
          </Button>
        </div>
      )}
    </div>
  )
}
