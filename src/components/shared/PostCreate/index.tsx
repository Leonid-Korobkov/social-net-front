'use client'
import { Editor, EditorContent } from '@tiptap/react'
import { EditorMenus } from './EditorMenus'

import '@/css/editor.css'
import '@/css/syntax-highlight.css'
import '@/css/tippy.css'
import { Spinner } from '@heroui/react'
import { extractFirstLink } from '@/utils/extractLink'
import LinkPreview from '../LinkPreview'
import { useUploadMedia } from '@/hooks/useUploadMedia'
import { UserSettingsStore } from '@/store/userSettings.store'
import { useStore } from 'zustand'

interface CreatePostProps {
  onSuccess?: () => void
  editor: Editor | null
  content: string
  clearContent: () => void
  characterCount: number
  wordCount: number
  isEmpty: boolean
  getHTML: () => string
}

function CreatePost({ editor, content }: CreatePostProps) {
  // Если редактор не был инициализирован, показываем заглушку
  if (!editor) {
    return (
      <div className="flex justify-center">
        <Spinner size="lg" color="primary" variant="gradient" />
      </div>
    )
  }
  const uploads = useStore(UserSettingsStore, state => state.mediaUploads)

  const firstLink = extractFirstLink(content)

  console.log(uploads)

  return (
    <div className="flex-grow">
      {/* Подключение меню форматирования */}
      <EditorMenus editor={editor} />

      {/* Сам редактор */}
      <div className="mb-3">
        <EditorContent editor={editor} className="w-full" />
      </div>

      {/* OpenGraph предпросмотр */}
      {firstLink && (!uploads || uploads.length === 0) && (
        <LinkPreview url={firstLink} />
      )}
    </div>
  )
}

export default CreatePost
