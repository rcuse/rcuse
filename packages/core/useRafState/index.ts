import type React from 'react'
import { useCallback, useRef, useState } from 'react'
import { useUnmount } from '../useUnmount'

export function useRafState<S>(initialState: S | (() => S)): [S, React.Dispatch<React.SetStateAction<S>>]
export function useRafState<S = undefined>(): [S | undefined, React.Dispatch<React.SetStateAction<S | undefined>>]

export function useRafState<S>(initialState?: S | (() => S)) {
  const ref = useRef(0)
  const [state, setState] = useState(initialState)

  const setRafState = useCallback((value: S | ((prevState: S) => S)) => {
    cancelAnimationFrame(ref.current)

    ref.current = requestAnimationFrame(() => {
      setState(value as any)
    })
  }, [])

  useUnmount(() => {
    cancelAnimationFrame(ref.current)
  })

  return [state, setRafState] as const
}
