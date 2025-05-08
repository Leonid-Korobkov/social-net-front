'use client'
import { useState, useRef, useEffect } from 'react'
import { Button } from '@heroui/react'
import { IoIosArrowDroprightCircle } from 'react-icons/io'
import RawHTML from '@/components/ui/EscapeHtml'
import Link from 'next/link'
import clsx from 'clsx'

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
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const checkHeight = () => {
      if (contentRef.current) {
        const lineHeight = parseInt(
          window.getComputedStyle(contentRef.current).lineHeight || '20'
        )
        const height = contentRef.current.scrollHeight
        const lines = Math.ceil(height / lineHeight)
        setShouldCollapse(lines > maxLines)
      }
    }

    // Используем setTimeout для гарантии, что контент полностью отрендерился
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
        className={clsx(shouldCollapse && 'line-clamp')}
        style={
          shouldCollapse
            ? { WebkitLineClamp: maxLines, lineClamp: maxLines }
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
