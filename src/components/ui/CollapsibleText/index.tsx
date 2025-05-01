'use client'
import { useState, useRef, useEffect } from 'react'
import { Button } from '@heroui/react'
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'
import RawHTML from '../EscapeHtml'

interface CollapsibleTextProps {
  content: string
  maxLines?: number
}

export default function CollapsibleText({
  content,
  maxLines = 5,
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

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <div className="relative">
      <div
        ref={contentRef}
        className={`${
          !isExpanded ? `line-clamp-${maxLines} overflow-hidden` : ''
        }`}
      >
        <RawHTML>{content}</RawHTML>
      </div>

      {shouldCollapse && (
        <div className="mt-2">
          <Button
            size="sm"
            variant="flat"
            color="default"
            onClick={toggleExpand}
            endContent={isExpanded ? <IoIosArrowUp /> : <IoIosArrowDown />}
          >
            {isExpanded ? 'Скрыть' : 'Читать далее'}
          </Button>
        </div>
      )}
    </div>
  )
}
