import { ImageResponse } from 'next/og'
import { IoSearch } from 'react-icons/io5'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const alt = 'Поиск в Zling'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
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

  try {
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 40,
            background: '#f2f2f2',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              maxWidth: 1100,
              padding: '30px 40px',
            }}
          >
            {/* Поисковая строка */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                height: 90,
                backgroundColor: 'white',
                borderRadius: 40,
                padding: '0 25px',
                marginBottom: 30,
                border: '1px solid #e0e0e0',
                boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  fontSize: 32,
                  color: '#71717A',
                  marginRight: 10,
                }}
              >
                <IoSearch />
              </div>
              <div style={{ color: '#333', marginRight: 'auto' }}>zling</div>
              <div
                style={{
                  backgroundColor: '#7827C8',
                  color: 'white',
                  padding: '10px 30px',
                  borderRadius: 25,
                  fontSize: 30,
                }}
              >
                Поиск
              </div>
            </div>

            {/* Горизонтальное меню */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                gap: 15,
                marginBottom: 40,
                fontSize: 32,
              }}
            >
              <div
                style={{
                  backgroundColor: '#7827C8',
                  color: 'white',
                  padding: '15px 50px',
                  borderRadius: 20,
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}
              >
                Все
              </div>
              <div
                style={{
                  color: '#71717A',
                  padding: '15px 50px',
                }}
              >
                Посты
              </div>
              <div
                style={{
                  color: '#71717A',
                  padding: '15px 50px',
                }}
              >
                Пользователи
              </div>
              <div
                style={{
                  color: '#71717A',
                  padding: '15px 50px',
                }}
              >
                Комментарии
              </div>
            </div>

            {/* Заголовок "Пользователи" */}
            <div
              style={{
                fontSize: 50,
                fontWeight: 'bold',
                color: '#333',
                marginBottom: 20,
              }}
            >
              Пользователи
            </div>

            {/* Карточка пользователя */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'white',
                padding: 20,
                borderRadius: 15,
                boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                width: '100%',
              }}
            >
              <div
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  backgroundColor: '#F4F4F5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 20,
                  fontSize: 30,
                  color: 'white',
                }}
              >
                <img
                  src={
                    'https://res.cloudinary.com/djsmqdror/image/upload/v1746368138/social-net/uycc5eujwb3jvsfgnuac.png'
                  }
                  width={90}
                  alt={'Zling логотип'}
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div
                  style={{
                    fontSize: 35,
                    fontWeight: 'bold',
                    color: '#333',
                  }}
                >
                  @zling
                </div>
                <div
                  style={{
                    color: '#71717A',
                  }}
                >
                  zling official - 100k подписчиков
                </div>
              </div>
            </div>
          </div>
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
  } catch (error) {
    return fallbackImage()
  }
}

async function fallbackImage() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 60,
          backgroundImage:
            'linear-gradient(to bottom, #9c66f6 0%, #663399 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          lineHeight: 1.2,
          textAlign: 'center',
          padding: 40,
        }}
      >
        <div style={{ fontSize: 80, fontWeight: 'bold', marginBottom: 20 }}>
          Zling
        </div>
        <div>Поиск</div>
        <div
          style={{
            fontSize: 30,
            marginTop: 40,
            maxWidth: 800,
          }}
        >
          Современная социальная сеть для своих
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
