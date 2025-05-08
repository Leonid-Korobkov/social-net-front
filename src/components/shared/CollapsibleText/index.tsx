'use client'
import { useState, useRef, useEffect } from 'react'
import { Button } from '@heroui/react'
import { IoIosArrowDroprightCircle } from 'react-icons/io'
import RawHTML from '@/components/ui/EscapeHtml'
import Link from 'next/link'

interface CollapsibleTextProps {
  content: string
  href: string
  title: string
  className?: any
  maxLines?: number
  maxHeight?: number
}

export default function CollapsibleText({
  className = '',
  content,
  maxLines = 15,
  href = '',
  title,
  maxHeight = 600,
}: CollapsibleTextProps) {
  const [shouldCollapse, setShouldCollapse] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const checkHeight = () => {
      if (contentRef.current) {
        const lineHeight = parseInt(
          window.getComputedStyle(contentRef.current).lineHeight
        )
        const height = contentRef.current.offsetHeight
        const lines = Math.ceil(height / lineHeight)

        // Устанавливаем флаг сворачивания текста, если он длиннее
        setShouldCollapse(height > maxHeight)
      }
    }

    // Запускаем проверку после полной загрузки содержимого
    const timer = setTimeout(checkHeight, 100)
    window.addEventListener('resize', checkHeight)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', checkHeight)
    }
  }, [content, maxLines])

  return (
    <div className="relative">
      <div
        ref={contentRef}
        className={shouldCollapse ? 'overflow-hidden' : ''}
        style={shouldCollapse ? { maxHeight: `${maxHeight}px` } : {}}
      >
        <RawHTML className={className}>{content}</RawHTML>
      </div>

      {shouldCollapse && (
        <div className="mt-2 text-foreground-400 text-sm">
          <div className="absolute bottom-[28px] left-0 right-0 h-10 bg-gradient-to-t from-content1 to-transparent z-[100]"></div>
          <Link href={href} className="flex gap-1 items-center" title={title}>
            <span>Читать далее</span>
            <IoIosArrowDroprightCircle />
          </Link>
        </div>
      )}
    </div>
  )
}
