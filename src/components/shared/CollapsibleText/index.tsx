'use client'
import { useState, useEffect } from 'react'
import { IoIosArrowDroprightCircle } from 'react-icons/io'
import RawHTML from '@/components/ui/EscapeHtml'
import Link from 'next/link'
import { stripHtml } from '@/utils/stripHtml'

interface CollapsibleTextProps {
  content: string
  href: string
  title: string
  className?: any
  maxLines?: number
}

export default function CollapsibleText({
  className = '',
  content,
  maxLines = 15,
  href = '',
  title,
}: CollapsibleTextProps) {
  const [shouldCollapse, setShouldCollapse] = useState(false)

  // Константа для максимальной длины текста (примерно 1000 символов)
  const MAX_TEXT_LENGTH = 1000

  useEffect(() => {
    // Преобразуем HTML в обычный текст
    const plainText = stripHtml(content)

    // Проверяем длину текста
    setShouldCollapse(plainText.length > MAX_TEXT_LENGTH)
  }, [content])

  return (
    <div className="relative">
      <div
        style={
          shouldCollapse
            ? {
                maxHeight: '30rem',
                overflow: 'hidden',
              }
            : {}
        }
      >
        <RawHTML className={className}>{content}</RawHTML>
      </div>

      {shouldCollapse && (
        <div className="mt-0 text-foreground-400 text-sm">
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-content1 to-transparent z-[100]"></div>
          <div className="relative z-[101] mt-2">
            <Link href={href} className="flex gap-1 items-center" title={title}>
              <span>Читать далее</span>
              <IoIosArrowDroprightCircle />
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
