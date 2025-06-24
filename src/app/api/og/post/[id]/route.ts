import { BACKEND_URL_FOR_OG } from '@/app/constants'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    if (!process.env.OPENGRAPH_SECRET_PATH) {
      console.error('OPENGRAPH_SECRET_PATH not configured')
      throw new Error('OpenGraph path not configured')
    }

    const { id } = await context.params

    const response = await fetch(`${BACKEND_URL_FOR_OG}/api/og/post/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        'x-opengraph-secret': process.env.OPENGRAPH_SECRET_PATH,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch post data: ${response.status}`)
    }

    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in OpenGraph post API route:', error)
    return NextResponse.json(
      { error: 'Failed to fetch post data' },
      { status: 500 }
    )
  }
}
