'use client'
import { Editor, EditorContent } from '@tiptap/react'
import { EditorMenus } from './EditorMenus'

import '@/css/editor.css'
import '@/css/syntax-highlight.css'
import '@/css/tippy.css'
import { Spinner } from '@heroui/react'

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

function CreatePost({ editor }: CreatePostProps) {
  // Если редактор не был инициализирован, показываем заглушку
  if (!editor) {
    return (
      <div className="flex justify-center">
        <Spinner size="lg" color="secondary" variant="gradient" />
      </div>
    )
  }

  return (
    <div className="flex-grow">
      {/* Подключение меню форматирования */}
      <EditorMenus editor={editor} />

      {/* Сам редактор */}
      <div className="mb-3">
        <EditorContent editor={editor} className="w-full" />
      </div>
    </div>
  )
}

export default CreatePost
