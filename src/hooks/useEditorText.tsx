'use client'

import CharacterCount from '@tiptap/extension-character-count'
import Code from '@tiptap/extension-code'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import Link from '@tiptap/extension-link'
import Mention from '@tiptap/extension-mention'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import { Editor, ReactNodeViewRenderer, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { common, createLowlight } from 'lowlight'
import 'tippy.js/animations/scale.css'

import CodeBlockComponent from '@/components/shared/PostCreate/CodeBlockComponent'
// import { createMentionSuggestion } from '@/components/shared/PostCreate/MentionList'
import { UserSettingsStore } from '@/store/userSettings.store'
import { useCallback, useEffect, useState } from 'react'
import { useStore } from 'zustand'

export type EditorHookProps = {
  initialContent?: string
  placeholder?: string
  characterLimit?: number
  autoFocus?: boolean
  onChange?: (html: string) => void
  storageKey?: string
}

export function useEditorText({
  initialContent = '',
  placeholder = 'Начните писать что-нибудь...',
  characterLimit = 10000,
  autoFocus = true,
  onChange,
  storageKey = 'postText',
}: EditorHookProps = {}) {
  // Используем zustand для хранения контента, если указан storageKey
  const content = useStore(UserSettingsStore, state =>
    storageKey === 'postText' ? state.postText : initialContent
  )
  const setContent = useStore(UserSettingsStore, state =>
    storageKey === 'postText' ? state.setPostText : undefined
  )
  const resetContent = useStore(UserSettingsStore, state =>
    storageKey === 'postText' ? state.reset : undefined
  )

  const [localContent, setLocalContent] = useState(initialContent)

  // Создаем инстанс lowlight с поддержкой дополнительных языков
  const lowlight = createLowlight(common)

  // Обработчик изменения контента
  const handleUpdate = useCallback(
    ({ editor }: { editor: Editor }) => {
      const newContent = editor.getHTML()

      // Обновляем контент в zustand если используем его
      if (setContent && storageKey === 'postText') {
        setContent(newContent)
      } else {
        // Иначе используем локальное состояние
        setLocalContent(newContent)
      }

      // Также вызываем внешний обработчик, если он предоставлен
      if (onChange) {
        onChange(newContent)
      }
    },
    [onChange, setContent, storageKey]
  )

  // Инициализируем редактор tiptap
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2],
        },
        // Отключаем стандартный CodeBlock, чтобы использовать CodeBlockLowlight
        codeBlock: false,
      }),
      Placeholder.configure({
        placeholder,
      }),
      CharacterCount.configure({
        limit: characterLimit,
      }),
      Underline,
      Link.configure({
        openOnClick: true,
        autolink: true,
        defaultProtocol: 'https',
        protocols: ['http', 'https'],
        HTMLAttributes: {
          rel: 'noopener noreferrer nofollow',
          target: '_blank',
        },
        isAllowedUri: (url, ctx) => {
          try {
            // construct URL
            const parsedUrl = url.includes(':')
              ? new URL(url)
              : new URL(`${ctx.defaultProtocol}://${url}`)

            // use default validation
            if (!ctx.defaultValidate(parsedUrl.href)) {
              return false
            }

            // disallowed protocols
            const disallowedProtocols = ['ftp', 'file', 'mailto']
            const protocol = parsedUrl.protocol.replace(':', '')

            if (disallowedProtocols.includes(protocol)) {
              return false
            }

            // only allow protocols specified in ctx.protocols
            const allowedProtocols = ctx.protocols.map(p =>
              typeof p === 'string' ? p : p.scheme
            )

            if (!allowedProtocols.includes(protocol)) {
              return false
            }

            // all checks have passed
            return true
          } catch {
            return false
          }
        },
      }),
      Code,
      // Настраиваем CodeBlockLowlight с кастомным NodeView
      CodeBlockLowlight.extend({
        addNodeView() {
          return ReactNodeViewRenderer(CodeBlockComponent)
        },
      }).configure({
        lowlight,
        defaultLanguage: 'plaintext',
        HTMLAttributes: {
          class: 'code-block',
        },
      }),
      Mention.configure({
        HTMLAttributes: {
          class: 'mention',
        },
        // suggestion: createMentionSuggestion(),
      }),
    ],
    content: content || initialContent,
    onUpdate: handleUpdate,
    autofocus: autoFocus,
    editorProps: {
      attributes: {
        class: 'pt-2 pb-2 focus:outline-none min-h-[200px] max-w-none',
      },
    },
  })

  // Обновляем контент редактора при изменении content из хранилища
  useEffect(() => {
    if (editor && content && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, [editor, content])

  // Очистка редактора
  const clearContent = useCallback(() => {
    if (!editor) return
    editor.commands.clearContent()

    if (resetContent && storageKey === 'postText') {
      resetContent()
    } else {
      setLocalContent('')
    }
  }, [editor, resetContent, storageKey])

  return {
    editor,
    content: storageKey === 'postText' ? content : localContent,
    clearContent,
    characterCount: editor?.storage.characterCount?.characters() || 0,
    wordCount: editor?.storage.characterCount?.words() || 0,
    isEmpty: editor?.isEmpty || true,
    getHTML: () => editor?.getHTML() || '',
  }
}

export default useEditorText
