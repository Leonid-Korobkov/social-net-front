'use client'
import React from 'react'

// Use for local storage
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = React.useState<T | undefined>(() => initialValue)

  // Gets initial value from localStorage if available
  React.useLayoutEffect(() => {
    let initialValue

    try {
      const localStorageValue = localStorage.getItem(key)

      initialValue =
        localStorageValue !== null ? parseJSON(localStorageValue) : initialValue

      setValue(initialValue)
    } catch (error) {
      setValue(initialValue)
    }
  }, [key])

  React.useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === key) {
        const newValue = e.newValue !== null ? parseJSON(e.newValue) : undefined
        setValue(newValue)
      }
    }

    window.addEventListener('storage', onStorage)

    return () => {
      window.removeEventListener('storage', onStorage)
    }
  }, [key])

  const set = React.useCallback(
    (newValue: T) => {
      try {
        setValue(newValue)

        if (typeof newValue === 'undefined') {
          localStorage.removeItem(key)
        } else {
          localStorage.setItem(key, JSON.stringify(newValue))
        }
      } catch (error) {
        console.error(error)
      }
    },
    [key]
  )

  const remove = React.useCallback(() => {
    try {
      setValue(undefined)
      localStorage.removeItem(key)
    } catch (error) {
      console.error(error)
    }
  }, [key])

  return [value, set, remove] as const
}

function parseJSON(value: string) {
  return value === 'undefined' ? undefined : JSON.parse(value)
}
