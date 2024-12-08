// This file serves as a central hub for re-exporting pre-typed Redux hooks.
// These imports are restricted elsewhere to ensure consistent
// usage of typed hooks throughout the application.
// We disable the ESLint rule here because this is the designated place
// for importing and re-exporting the typed versions of hooks.
/* eslint-disable @typescript-eslint/no-restricted-imports */
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from './store'
import React from 'react'

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()

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
    [key],
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
