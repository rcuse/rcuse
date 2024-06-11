import { useCallback, useEffect, useRef } from 'react'
import { isNumber } from '@rcuse/shared'
import { useMemoizedFn } from '../useMemoizedFn'

export function useTimeout(fn: (...args: any[]) => void, delay?: number) {
  const timerCallback = useMemoizedFn(fn)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clear = useCallback(() => {
    if (timerRef.current)
      clearTimeout(timerRef.current)
  }, [])

  useEffect(() => {
    if (!isNumber(delay) || delay < 0)
      return

    timerRef.current = setTimeout(timerCallback, delay)
    return clear
  }, [delay])

  return clear
}
