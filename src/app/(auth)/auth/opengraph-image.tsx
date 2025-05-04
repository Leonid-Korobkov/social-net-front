import { ImageResponse } from 'next/og'
export const Thumbnail = '/Zling-logo-black.svg'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const alt = 'Zling - Социальная сеть'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function OpImage() {
  const rubik = await readFile(
    join(process.cwd(), '/assets/font/Rubik-SemiBold.ttf')
  )

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
          width={400}
          alt={'Zling логотип'}
          style={{ objectFit: 'cover' }}
        />
        <div
          style={{
            display: 'flex',
            gap: 30,
            marginTop: 20,
          }}
        >
          <div
            style={{
              backgroundColor: '#1E102B',
              padding: '16px 32px',
              borderRadius: 20,
              fontSize: 36,
              fontWeight: 'bold',
              color: '#AE7EDE',
            }}
          >
            Авторизация
          </div>
          <div
            style={{
              backgroundColor: '#1E102B',
              padding: '16px 32px',
              borderRadius: 20,
              fontSize: 36,
              fontWeight: 'bold',
              color: '#AE7EDE',
            }}
          >
            Регистрация
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'Rubik',
          data: rubik,
          style: 'normal',
          weight: 400,
        },
      ],
    }
  )
}
