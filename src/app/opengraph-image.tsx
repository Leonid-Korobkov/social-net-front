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
  console.log(rubik)

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 60,
          backgroundColor: '18181B',
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
        {/* <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            padding: '60px 80px',
            borderRadius: 30,
            backdropFilter: 'blur(10px)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
            border: '2px solid rgba(255, 255, 255, 0.1)',
          }}
        > */}
        {/* <div
            style={{
              fontSize: 120,
              fontWeight: 'bold',
              marginBottom: 20,
              backgroundImage:
                'linear-gradient(90deg, #ffffff 0%, #e0e0e0 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
            }}
          >
            Zling
          </div> */}
        <img
          src={
            'https://res.cloudinary.com/djsmqdror/image/upload/v1746202177/social-net/wbk0hwzwrswxcwtfhnit.png'
          }
          width={300}
          height={300}
          alt={'Zling логотип'}
          style={{ objectFit: 'cover' }}
        />
        <div
          style={{
            fontSize: 40,
            marginBottom: 40,
            maxWidth: 800,
            lineHeight: 1.2,
          }}
        >
          Социальная сеть для своих
        </div>

        <div
          style={{
            display: 'flex',
            gap: 30,
            marginTop: 20,
          }}
        >
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              padding: '16px 32px',
              borderRadius: 20,
              fontSize: 36,
              fontWeight: 'bold',
            }}
          >
            Общение
          </div>
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              padding: '16px 32px',
              borderRadius: 20,
              fontSize: 36,
              fontWeight: 'bold',
            }}
          >
            Новости
          </div>
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              padding: '16px 32px',
              borderRadius: 20,
              fontSize: 36,
              fontWeight: 'bold',
            }}
          >
            Друзья
          </div>
        </div>
        {/* </div> */}
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
