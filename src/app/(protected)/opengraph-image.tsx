import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const alt = 'Zling - Социальная сеть'
export const size = {
  width: 1200,
  height: 1200,
}
export const contentType = 'image/png'

export default async function OpImage() {
  let fontData
  try {
    fontData = await readFile(
      join(process.cwd(), '/assets/font/Rubik-SemiBold.ttf')
    )
  } catch (error) {
    try {
      fontData = await readFile(
        join(process.cwd(), 'public/assets/font/Rubik-SemiBold.ttf')
      )
    } catch (error) {
      console.error('Не удалось загрузить шрифт:', error)
      fontData = null
    }
  }
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
          src={
            'https://res.cloudinary.com/djsmqdror/image/upload/v1746202177/social-net/wbk0hwzwrswxcwtfhnit.png'
          }
          height={1000}
          alt={'Zling логотип'}
          style={{ objectFit: 'cover' }}
        />
      </div>
    ),
    {
      ...size,
      fonts: fontData
        ? [
            {
              name: 'Rubik',
              data: fontData,
              style: 'normal',
              weight: 600,
            },
          ]
        : undefined,
    }
  )
}
