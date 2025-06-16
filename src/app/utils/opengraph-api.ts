import { headers } from 'next/headers'

export async function fetchOpenGraphPostData(id: string) {
  try {
    const headersList = await headers()
    const host = headersList.get('host')
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'

    const response = await fetch(`${protocol}://${host}/og/post/${id}`, {
      next: {
        revalidate: 3600, // Кэшируем на 1 час
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch post data: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching OpenGraph post data:', error)
    return null
  }
}

export async function fetchOpenGraphUserData(username: string) {
  try {
    const headersList = await headers()
    const host = headersList.get('host')
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'

    const response = await fetch(
      `${protocol}://${host}/og/user/${username}`,
      {
        next: {
          revalidate: 3600, // Кэшируем на 1 час
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch user data: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching OpenGraph user data:', error)
    return null
  }
}
