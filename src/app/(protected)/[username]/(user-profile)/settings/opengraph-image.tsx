import { ImageResponse } from 'next/og'
import { fetchOpenGraphUserData } from '@/app/utils/opengraph-api'
import {
  DEFAULT_SIZE,
  DEFAULT_CONTENT_TYPE,
  loadFont,
  generateFallbackImage,
} from '@/app/utils/fallback-opengraph'

export const alt = 'Настройки профиля в Zling'
export const size = DEFAULT_SIZE
export const contentType = DEFAULT_CONTENT_TYPE

export default async function Image({
  params,
}: {
  params: { username: string }
}) {
  const fontData = await loadFont()
  try {
    const user = await fetchOpenGraphUserData(params.username)
    if (!user) {
      return generateFallbackImage({
        title: 'Настройки профиля',
        subtitle: 'Zling — социальная сеть для своих',
        fontData,
      })
    }
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 48,
            background: 'linear-gradient(90deg, #e0c3fc 0%, #8ec5fc 100%)',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            <div style={{ fontSize: 120, color: '#9353D3' }}>⚙️</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span
                style={{ fontWeight: 'bold', fontSize: 56, color: '#6120A0' }}
              >
                Настройки профиля
              </span>
              <span style={{ fontSize: 36, color: '#333' }}>{user.name}</span>
              <span style={{ fontSize: 28, color: '#9353D3' }}>
                @{user.userName}
              </span>
            </div>
          </div>
          <div
            style={{
              position: 'absolute',
              bottom: 32,
              right: 48,
              fontSize: 24,
              color: '#9353D3',
              fontWeight: 'bold',
            }}
          >
            Zling
          </div>
        </div>
      ),
      {
        ...size,
        fonts: fontData
          ? [{ name: 'Rubik', data: fontData, style: 'normal', weight: 600 }]
          : undefined,
      }
    )
  } catch (error) {
    return generateFallbackImage({
      title: 'Настройки профиля',
      subtitle: 'Zling — социальная сеть для своих',
      fontData,
    })
  }
}
