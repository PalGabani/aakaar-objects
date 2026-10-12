import { useRef, useState } from 'react'

type StoredResult<T> = { value: T; error: string | null }

export function useStoredState<T>(key: string, fallback: T) {
  const [stored, setStored] = useState<StoredResult<T>>(() => {
    try {
      const raw = window.localStorage.getItem(key)
      return { value: raw ? (JSON.parse(raw) as T) : fallback, error: null }
    } catch (error) {
      console.error(`Unable to load ${key} from browser storage.`, error)
      return { value: fallback, error: 'Some saved shop data could not be loaded.' }
    }
  })
  const storedRef = useRef(stored)
  const updateStored = (value: T | ((previous: T) => T)) => {
    const nextValue =
      typeof value === 'function'
        ? (value as (previous: T) => T)(storedRef.current.value)
        : value
    let nextStored: StoredResult<T> = { value: nextValue, error: null }
    try {
      window.localStorage.setItem(key, JSON.stringify(nextValue))
    } catch (error) {
      console.error(`Unable to save ${key} to browser storage.`, error)
      nextStored = { value: nextValue, error: 'Your changes may not be saved in this browser.' }
    }
    storedRef.current = nextStored
    setStored(nextStored)
  }

  return [stored.value, updateStored, stored.error] as const
}
