import { ImageResponse } from 'next/og'
export const Thumbnail = '/Zling-logo-black.svg'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const alt = 'Zling - Социальная сеть'
export const size = {
  width: 600,
  height: 600,
}
export const contentType = 'image/png'

export default async function OpImage() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 60,
          backgroundColor: '#000',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          textAlign: 'center',
          padding: 40,
        }}
      >
        <img
          src={'https://zling.vercel.app/Zling-logo-white.svg'}
          width={500}
          alt={'Zling логотип'}
          style={{ objectFit: 'cover' }}
        />
      </div>
    ),
    {
      ...size,
    }
  )
}
