import { User } from '@/store/types'

export async function fetchUserData(username: string): Promise<User | null> {
  try {
    const response = await fetch(`/api/users/${username}`, {
      // Используем относительный путь, так как запрос будет идти на тот же домен
      next: {
        revalidate: 3600, // Ревалидация каждые 2 часа
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch user data: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching user data:', error)
    return null
  }
}
