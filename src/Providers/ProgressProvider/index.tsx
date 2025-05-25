'use client'
import NextTopLoader from 'nextjs-toploader'
import './ProgressProvider.css'
import React from 'react'

function ProgressProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NextTopLoader crawl={true} showSpinner={false} height={0} />
      {children}
    </>
  )
}

export default ProgressProvider
