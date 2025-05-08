'use client'
import { useState, useEffect, useRef } from 'react'
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
      <div ref={contentRef} className='preview-text'>
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
