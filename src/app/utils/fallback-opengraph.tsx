import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const DEFAULT_SIZE = {
  width: 1200,
  height: 630,
}

export const DEFAULT_CONTENT_TYPE = 'image/png'

export async function loadFont() {
  try {
    return await readFile(
      join(process.cwd(), '/assets/font/Rubik-SemiBold.ttf')
    )
  } catch (error) {
    try {
      return await readFile(
        join(process.cwd(), 'public/assets/font/Rubik-SemiBold.ttf')
      )
    } catch (error) {
      console.error('Не удалось загрузить шрифт:', error)
      return null
    }
  }
}

export async function generateFallbackImage({
  title,
  subtitle,
  fontData,
  size = DEFAULT_SIZE,
  avatarUrl,
}: {
  title: string
  subtitle?: string
  fontData: Buffer | null
  size?: { width: number; height: number }
  avatarUrl?: string
}) {
  // Если есть URL аватара, используем его как фоновое изображение
  if (avatarUrl) {
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            position: 'relative',
          }}
        >
          <img
            src={avatarUrl.replace('.webp', '.png')}
            alt={title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background:
                'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
              padding: '40px',
              color: 'white',
            }}
          >
            <div style={{ fontSize: 48, fontWeight: 'bold', marginBottom: 8 }}>
              {title}
            </div>
            {subtitle && (
              <div style={{ fontSize: 24, opacity: 0.8 }}>{subtitle}</div>
            )}
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
  }

  // Стандартный фолбэк без аватара
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
        <div>{title}</div>
        {subtitle && (
          <div
            style={{
              fontSize: 30,
              marginTop: 40,
              maxWidth: 800,
            }}
          >
            {subtitle}
          </div>
        )}
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

export async function handleApiError(error: unknown, context: string) {
  console.error(`Ошибка при генерации OpenGraph для ${context}:`, error)
  if (error instanceof Error) {
    console.error('Детали ошибки:', error.message)
  }
}
