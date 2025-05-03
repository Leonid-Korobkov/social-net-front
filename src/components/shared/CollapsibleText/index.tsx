'use client'
import { Button } from '@heroui/react'
import { useEffect, useRef, useState } from 'react'
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'
import RawHTML from '../../ui/EscapeHtml'

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
