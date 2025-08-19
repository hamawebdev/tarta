import { useEffect, useState } from 'react'

/**
 * Custom hook to handle hydration-safe state management
 * Returns true only after the component has hydrated on the client
 */
export function useHydration() {
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  return isHydrated
}

/**
 * Custom hook for hydration-safe client-only rendering
 * Returns the provided value only after hydration, otherwise returns the fallback
 */
export function useClientOnly<T>(value: T, fallback: T) {
  const isHydrated = useHydration()
  return isHydrated ? value : fallback
}
