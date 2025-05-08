'use client'
import '@/css/editor.css'
import '@/css/syntax-highlight.css'
import '@/css/tippy.css'
import parse, {
  Element,
  HTMLReactParserOptions,
  Text
} from 'html-react-parser'
import React, { useMemo } from 'react'
import { common, createLowlight } from 'lowlight'
// Импортируем только базовые языки для подсветки
import { getLanguageIcon, getLanguageName } from '@/utils/languages'

// Создаем инстанс lowlight с поддержкой языков
const lowlight = createLowlight(common)

interface RawHTMLProps {
  children: string
  className?: string
}

// Преобразование узла lowlight в HTML-строку с тегами span для подсветки
const nodeToHtml = (node: any): string => {
  if (node.type === 'text') {
    return node.value
  }

  if (node.type === 'element') {
    const classAttr = node.properties?.className
      ? ` class="${
          Array.isArray(node.properties.className)
            ? node.properties.className.join(' ')
            : node.properties.className
        }"`
      : ''

    const children = node.children?.map(nodeToHtml).join('') || ''

    return `<span${classAttr}>${children}</span>`
  }

  return ''
}

const RawHTML: React.FC<RawHTMLProps> = ({ children, className = '' }) => {
  // Опции для парсера
  const options: HTMLReactParserOptions = useMemo(
    () => ({
      replace: domNode => {
        if (
          domNode instanceof Element &&
          domNode.name === 'pre' &&
          domNode.children[0] instanceof Element &&
          domNode.children[0].name === 'code'
        ) {
          // Получаем элемент code внутри pre
          const codeElement = domNode.children[0] as Element

          // Пытаемся определить язык из атрибутов
          const languageClass = codeElement.attribs.class || ''
          const languageMatch = languageClass.match(/language-(\w+)/)
          const language = languageMatch ? languageMatch[1] : 'plaintext'

          // Получаем содержимое кода
          let codeContent = ''
          if (codeElement.children[0] && 'data' in codeElement.children[0]) {
            codeContent = codeElement.children[0].data || ''
          }

          try {
            // Выполняем подсветку синтаксиса
            const highlighted = lowlight.highlight(language, codeContent)

            // Преобразуем результат в HTML для подсветки
            const highlightedHtml = highlighted.children
              .map(node => nodeToHtml(node))
              .join('')

            // Получаем иконку и название языка
            const languageIcon = getLanguageIcon(language)
            const languageName = getLanguageName(language)

            // Возвращаем стилизованный блок кода с правильными классами
            return (
              <div className="code-block my-4" data-language={language}>
                <div className="code-block-header">
                  <span className="flex items-center gap-2">
                    <span className="text-default-500">{languageIcon}</span>
                    <span>{languageName}</span>
                  </span>
                </div>
                <pre>
                  <code
                    className={`language-${language}`}
                    dangerouslySetInnerHTML={{ __html: highlightedHtml }}
                  />
                </pre>
              </div>
            )
          } catch (error) {
            console.error('Ошибка подсветки синтаксиса:', error)
            // В случае ошибки возвращаем обычный блок кода
            const languageIcon = getLanguageIcon(language)
            const languageName = getLanguageName(language)

            return (
              <div className="code-block my-4" data-language={language}>
                <div className="code-block-header">
                  <span className="flex items-center gap-2">
                    <span className="text-default-500">{languageIcon}</span>
                    <span>{languageName}</span>
                  </span>
                </div>
                <pre>
                  <code className={languageClass}>{codeContent}</code>
                </pre>
              </div>
            )
          }
        } else if (domNode instanceof Text) {
          // Заменяем символы новой строки на HTML-теги <br />
          const textContent = domNode.data
          if (textContent.includes('\n')) {
            return (
              <>
                {textContent.split('\n').map((line, index, array) => (
                  <React.Fragment key={index}>
                    {line}
                    {index < array.length - 1 && <br />}
                  </React.Fragment>
                ))}
              </>
            )
          }
        }

        return undefined
      },
    }),
    []
  )

  return <div className={`tiptap ${className}`}>{parse(children, options)}</div>
}

export default RawHTML
