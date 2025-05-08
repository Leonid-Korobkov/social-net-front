'use client'
import { useState, useEffect, useRef } from 'react'
import {
  IoIosArrowDown,
  IoIosArrowDroprightCircle,
  IoIosArrowUp,
} from 'react-icons/io'
import RawHTML from '@/components/ui/EscapeHtml'
import Link from 'next/link'
import { stripHtml } from '@/utils/stripHtml'
import { Button } from '@heroui/react'

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
  maxLines = 20,
  href = '',
  title,
}: CollapsibleTextProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [shouldCollapse, setShouldCollapse] = useState(false)
  const [maxHeight, setMaxHeight] = useState<number | null>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const scrollPosRef = useRef<number>(0)

  const TRANSITION_MS = 400

  // измеряем, нужно ли резать текст, и задаём начальный max-height
  useEffect(() => {
    if (!contentRef.current) return
    const style = window.getComputedStyle(contentRef.current)
    const lineHeight = parseInt(style.lineHeight)
    const fullHeight = contentRef.current.scrollHeight
    const lines = Math.ceil(fullHeight / lineHeight)

    setShouldCollapse(lines > maxLines)
    setMaxHeight(isExpanded ? fullHeight : lineHeight * maxLines)
  }, [content, maxLines, isExpanded])

  const toggleExpand = () => {
    if (isExpanded) {
      window.scrollTo({ top: scrollPosRef.current, behavior: 'smooth' })

      if (contentRef.current) {
        const lineHeight = parseInt(
          window.getComputedStyle(contentRef.current).lineHeight
        )
        setMaxHeight(lineHeight * maxLines)
      }
      setIsExpanded(false)
    } else {
      scrollPosRef.current = window.pageYOffset

      if (contentRef.current) {
        setMaxHeight(contentRef.current.scrollHeight)
      }
      setIsExpanded(true)
    }
  }

  return (
    <div className="relative">
      <div
        ref={contentRef}
        style={{
          maxHeight: maxHeight !== null ? `${maxHeight}px` : 'none',
          overflow: 'hidden',
          transition: `max-height ${TRANSITION_MS}ms ease`,
        }}
      >
        <RawHTML className={className}>{content}</RawHTML>
      </div>

      {shouldCollapse && (
        <div className="mt-0 text-foreground-400 text-sm">
          {!isExpanded && (
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-content1 to-transparent z-[100]"></div>
          )}
          <div className="relative z-[101] mt-2">
            {/* <Link href={href} className="flex gap-1 items-center" title={title}> */}
            <div
              className="non-click cursor-pointer flex items-center gap-1"
              onClick={toggleExpand}
            >
              <span>{isExpanded ? 'Скрыть' : 'Читать далее'}</span>
              {isExpanded ? <IoIosArrowUp /> : <IoIosArrowDown />}
            </div>
            {/* </Link> */}
          </div>
        </div>
      )}
    </div>
  )
}
