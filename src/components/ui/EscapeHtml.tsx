'use client'
import React, { useMemo } from 'react'

function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function useEscapedHtml(rawHtml: string): string {
  return useMemo(() => escapeHtml(rawHtml), [rawHtml])
}

interface RawHTMLProps {
  children: string
  className?: string
}

const RawHTML: React.FC<RawHTMLProps> = ({ children, className = '' }) => {
  const escapedHtml = useEscapedHtml(children)

  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{ __html: escapedHtml.replace(/\n/g, '<br />') }}
    />
  )
}

export default RawHTML
