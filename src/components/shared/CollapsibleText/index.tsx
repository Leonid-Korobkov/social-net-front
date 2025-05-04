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
  const contentRef = useRef<HTMLDivElement>(null)
  const [collapsedScale, setCollapsedScale] = useState(1)  // во сколько раз надо сжать
  const TRANSITION_MS = 400

  // при каждом контенте / ресайзе считаем:
  // fullHeight — полная высота, collapsedHeight — высота maxLines
  useEffect(() => {
    if (!contentRef.current) return
    const style = window.getComputedStyle(contentRef.current)
    const lineHeight = parseInt(style.lineHeight)
    const fullHeight = contentRef.current.scrollHeight
    const collapsedHeight = lineHeight * maxLines

    setShouldCollapse(fullHeight > collapsedHeight)
    // во сколько раз нужно сжать, чтобы влезло collapsedHeight
    setCollapsedScale(collapsedHeight / fullHeight)
  }, [content, maxLines])

  const toggleExpand = () => {
    setIsExpanded(prev => !prev)
  }

  return (
    <div className="relative">
      <div
        style={{
          overflow: 'hidden',
          // контейнером будет «сжимаемый» inner-блок
        }}
      >
        <div
          ref={contentRef}
          style={{
            transform: isExpanded ? 'scaleY(1)' : `scaleY(${collapsedScale})`,
            transformOrigin: 'top',
            transition: `transform ${TRANSITION_MS}ms ease`,
          }}
        >
          <RawHTML>{content}</RawHTML>
        </div>
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
