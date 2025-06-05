import { ImageResponse } from 'next/og'
import {
  DEFAULT_SIZE,
  DEFAULT_CONTENT_TYPE,
  loadFont,
  generateFallbackImage,
  handleApiError,
} from '@/app/utils/fallback-opengraph'

export const alt = 'Подтверждение email в Zling'
export const size = DEFAULT_SIZE
export const contentType = DEFAULT_CONTENT_TYPE

export default async function Image() {
  const fontData = await loadFont()

  try {
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 40,
            background: 'linear-gradient(90deg, #f5f5f5 0%, #e0e0e0 100%)',
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
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              backgroundImage:
                'linear-gradient(to bottom, #9c66f6 0%, #663399 100%)',
              opacity: 0.1,
            }}
          />
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: 40,
              width: '100%',
              height: '100%',
              justifyContent: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              borderRadius: 20,
              border: '4px solid #663399',
              maxWidth: 1000,
              maxHeight: 550,
              margin: 'auto',
              position: 'relative',
              zIndex: 1,
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 30,
              }}
            >
              <img
                src="https://res.cloudinary.com/djsmqdror/image/upload/v1746368138/social-net/uycc5eujwb3jvsfgnuac.png"
                width={200}
                alt="Zling логотип"
                style={{ objectFit: 'cover' }}
              />
              <h1
                style={{
                  fontSize: 60,
                  fontWeight: 'bold',
                  margin: 0,
                  lineHeight: 1,
                  color: '#6120A0',
                  textAlign: 'center',
                }}
              >
                Подтверждение email
              </h1>
              <div
                style={{
                  fontSize: 30,
                  color: '#555555',
                  textAlign: 'center',
                  maxWidth: 600,
                }}
              >
                Для завершения регистрации необходимо подтвердить ваш email
                адрес
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
    await handleApiError(error, 'подтверждения email')

    return generateFallbackImage({
      title: 'Подтверждение email',
      subtitle:
        'Для завершения регистрации необходимо подтвердить ваш email адрес',
      fontData,
    })
  }
}
