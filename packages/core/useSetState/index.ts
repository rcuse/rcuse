import { useCallback, useState } from 'react'

type Patch<T> = Partial<T> | ((prevState: T) => Partial<T>)

export function useSetState<T extends object>(initialState: T | (() => T) = {} as T): [T, (patch: Patch<T>) => void] {
  const [state, set] = useState<T>(initialState)
  const setState = useCallback((patch: Patch<T>) => {
    set(prevState =>
      Object.assign({}, prevState, patch instanceof Function ? patch(prevState) : patch),
    )
  }, [])

  return [state, setState]
}
