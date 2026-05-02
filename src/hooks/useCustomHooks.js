import { useState, useEffect, useCallback, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { addToast } from '../redux/slices/uiSlice'

/**
 * Debounce hook - delays execution until after wait ms have passed
 * Used for search inputs to avoid excessive API calls
 * @param {any} value - The value to debounce
 * @param {number} delay - Delay in milliseconds (default: 300ms)
 */
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer) // Cleanup on re-render
  }, [value, delay])

  return debouncedValue
}

/**
 * Toast notification hook - dispatches toast messages to Redux
 */
export function useToast() {
  const dispatch = useDispatch()

  const showToast = useCallback((message, type = 'info') => {
    dispatch(addToast({ message, type }))
  }, [dispatch])

  return {
    success: (msg) => showToast(msg, 'success'),
    error: (msg) => showToast(msg, 'error'),
    info: (msg) => showToast(msg, 'info'),
    warning: (msg) => showToast(msg, 'warning'),
  }
}

/**
 * Local storage hook - syncs state with localStorage
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key)
      return stored ? JSON.parse(stored) : initialValue
    } catch {
      return initialValue
    }
  })

  const setStoredValue = useCallback((newValue) => {
    setValue(newValue)
    localStorage.setItem(key, JSON.stringify(newValue))
  }, [key])

  return [value, setStoredValue]
}

/**
 * Polling hook - calls a function at regular intervals
 * Used for real-time data refresh
 * @param {Function} callback - Function to call
 * @param {number} interval - Interval in ms
 * @param {boolean} active - Whether polling is active
 */
export function usePolling(callback, interval = 30000, active = true) {
  const savedCallback = useRef(callback)

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    if (!active) return
    const tick = () => savedCallback.current()
    const id = setInterval(tick, interval)
    return () => clearInterval(id)
  }, [interval, active])
}

/**
 * Intersection observer hook - for lazy loading / infinite scroll detection
 */
export function useIntersectionObserver(options = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsIntersecting(entry.isIntersecting),
      options
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return [ref, isIntersecting]
}

/**
 * Previous value hook - tracks the previous value of a variable
 */
export function usePrevious(value) {
  const ref = useRef()
  useEffect(() => { ref.current = value })
  return ref.current
}
