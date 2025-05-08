'use client'

import { BubbleMenu, FloatingMenu, Editor } from '@tiptap/react'
import { Divider } from '@heroui/react'
import 'tippy.js/animations/scale.css'
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaStrikethrough,
  FaCode,
  FaLink,
  FaListOl,
  FaListUl,
  FaHeading,
  FaUndo,
  FaRedo,
  FaQuoteRight,
  FaMinus,
  FaRegFileCode,
} from 'react-icons/fa'

// Конфигурация для меню форматирования
const getMenuConfig = (animationType = 'shift-away') => ({
  arrow: false,
  maxWidth: '90vw',
  placement: 'top' as const,
  offset: [0, 10] as [number, number],
  animation: animationType,
  duration: [300, 200] as [number, number],
  inertia: true,
})

interface EditorMenusProps {
  editor: Editor
}

export const EditorMenus = ({ editor }: EditorMenusProps) => {
  // Обработка добавления ссылки
  // const setLink = () => {
  //   if (!editor) return
  //   const previousUrl = editor.getAttributes('link').href
  //   const url = window.prompt('URL', previousUrl)
  //   if (url === null) return
  //   if (url === '') {
  //     editor.chain().focus().extendMarkRange('link').unsetLink().run()
  //     return
  //   }
  //   editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  // }

  // Защита от использования неинициализированного редактора
  if (!editor) {
    return null
  }

  return (
    <>
      {/* Панель плавающего меню */}
      <FloatingMenu
        editor={editor}
        tippyOptions={getMenuConfig('shift-away')}
        className="flex gap-1 items-center max-w-[100vw]"
      >
        <div className="editor-menu overflow-x-auto max-w-[100vw]">
          {/* Группа отмены/повтора */}
          <button
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="btn-editor"
            data-active={!editor.can().undo()}
          >
            <FaUndo size={16} />
          </button>
          <button
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="btn-editor"
            data-active={!editor.can().redo()}
          >
            <FaRedo size={16} />
          </button>

          <Divider orientation="vertical" className="h-6 w-1 rounded-full" />

          {/* Группа форматирования текста */}
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className="btn-editor"
            data-active={editor.isActive('bold')}
          >
            <FaBold size={16} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className="btn-editor"
            data-active={editor.isActive('italic')}
          >
            <FaItalic size={16} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className="btn-editor"
            data-active={editor.isActive('underline')}
          >
            <FaUnderline size={16} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className="btn-editor"
            data-active={editor.isActive('strike')}
          >
            <FaStrikethrough size={16} />
          </button>

          <Divider orientation="vertical" className="h-6 w-1 rounded-full" />

          {/* Группа структуры */}
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className="btn-editor"
            data-active={editor.isActive('heading', { level: 2 })}
          >
            <FaHeading size={16} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className="btn-editor"
            data-active={editor.isActive('bulletList')}
          >
            <FaListUl size={16} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className="btn-editor"
            data-active={editor.isActive('orderedList')}
          >
            <FaListOl size={16} />
          </button>

          <Divider orientation="vertical" className="h-6 w-1 rounded-full" />

          {/* Группа кода и ссылок */}
          <button
            onClick={() => editor.chain().focus().toggleCode().run()}
            className="btn-editor"
            data-active={editor.isActive('code')}
          >
            <FaCode size={16} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className="btn-editor"
            data-active={editor.isActive('codeBlock')}
          >
            <FaRegFileCode size={16} />
          </button>
          {/* <button
            onClick={setLink}
            className="btn-editor"
            data-active={editor.isActive('link')}
          >
            <FaLink size={16} />
          </button> */}

          <Divider orientation="vertical" className="h-6 w-1 rounded-full" />

          {/* Группа цитат и разделителей */}
          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className="btn-editor"
            data-active={editor.isActive('blockquote')}
          >
            <FaQuoteRight size={16} />
          </button>
          <button
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            className="btn-editor"
          >
            <FaMinus size={16} />
          </button>
        </div>
      </FloatingMenu>

      {/* Меню при выделении текста */}
      <BubbleMenu
        updateDelay={0}
        editor={editor}
        tippyOptions={getMenuConfig('shift-away')}
        className="flex gap-1 items-center max-w-[100vw] overflow-x-auto"
      >
        <div className="editor-menu overflow-x-auto max-w-[100vw]">
          {/* Группа отмены/повтора */}
          <button
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="btn-editor"
            data-active={!editor.can().undo()}
          >
            <FaUndo size={16} />
          </button>
          <button
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="btn-editor"
            data-active={!editor.can().redo()}
          >
            <FaRedo size={16} />
          </button>

          <Divider orientation="vertical" className="h-6 w-1 rounded-full" />

          {/* Группа форматирования текста */}
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className="btn-editor"
            data-active={editor.isActive('bold')}
          >
            <FaBold size={16} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className="btn-editor"
            data-active={editor.isActive('italic')}
          >
            <FaItalic size={16} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className="btn-editor"
            data-active={editor.isActive('underline')}
          >
            <FaUnderline size={16} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className="btn-editor"
            data-active={editor.isActive('strike')}
          >
            <FaStrikethrough size={16} />
          </button>

          <Divider orientation="vertical" className="h-6 w-1 rounded-full" />

          {/* Группа структуры */}
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className="btn-editor"
            data-active={editor.isActive('heading', { level: 2 })}
          >
            <FaHeading size={16} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className="btn-editor"
            data-active={editor.isActive('bulletList')}
          >
            <FaListUl size={16} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className="btn-editor"
            data-active={editor.isActive('orderedList')}
          >
            <FaListOl size={16} />
          </button>

          <Divider orientation="vertical" className="h-6 w-1 rounded-full" />

          {/* Группа кода и ссылок */}
          <button
            onClick={() => editor.chain().focus().toggleCode().run()}
            className="btn-editor"
            data-active={editor.isActive('code')}
          >
            <FaCode size={16} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className="btn-editor"
            data-active={editor.isActive('codeBlock')}
          >
            <FaRegFileCode size={16} />
          </button>

          <Divider orientation="vertical" className="h-6 w-1 rounded-full" />

          {/* Группа цитат */}
          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className="btn-editor"
            data-active={editor.isActive('blockquote')}
          >
            <FaQuoteRight size={16} />
          </button>
          {/* <button
            onClick={setLink}
            className="btn-editor"
            data-active={editor.isActive('link')}
          >
            <FaLink size={16} />
          </button> */}
        </div>
      </BubbleMenu>
    </>
  )
}

export default EditorMenus
