import { useState } from 'react'
import { useLayoutEffect } from '../helpers/useLayoutEffect'
import { useReactId } from './useReactId'

let count = 0

export function useId(staticId?: string) {
  const reactId = useReactId()
  const [id, setId] = useState(reactId)

  useLayoutEffect(() => {
    if (!staticId)
      setId((reactId: string) => reactId ?? String(count++))
  }, [])

  return staticId || (id ? `rcuse-${id}` : '')
}
