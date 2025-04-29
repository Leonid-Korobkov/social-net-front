'use client'
import NextTopLoader from 'nextjs-toploader'

function ProgressProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NextTopLoader
        color="#9353D3"
        crawl={true}
        showSpinner={false}
        shadow="0 0 10px #2299DD,0 0 5px #2299DD"
      />
      {children}
    </>
  )
}

export default ProgressProvider
