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
}

export default function CollapsibleText({
  className = '',
  content,
  maxLines = 5,
  href = '',
  title,
}: CollapsibleTextProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [shouldCollapse, setShouldCollapse] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const checkHeight = () => {
      if (contentRef.current) {
        const lineHeight = parseInt(
          window.getComputedStyle(contentRef.current).lineHeight
        )
        const height = contentRef.current.scrollHeight
        const lines = Math.ceil(height / lineHeight)
        setShouldCollapse(lines > maxLines)
      }
    }

    checkHeight()
    window.addEventListener('resize', checkHeight)
    return () => window.removeEventListener('resize', checkHeight)
  }, [content, maxLines])

  return (
    <div className="relative">
      <div
        ref={contentRef}
        className={`${
          !isExpanded ? `line-clamp-[${maxLines}] overflow-hidden` : ''
        }`}
      >
        <RawHTML className={className}>{content}</RawHTML>
      </div>

      {shouldCollapse && (
        <div className="mt-2 text-foreground-400 text-sm">
          <Link href={href} className="flex gap-1 items-center" title={title}>
            <span>Читать далее</span>
            <IoIosArrowDroprightCircle />
          </Link>
        </div>
      )}
    </div>
  )
}
