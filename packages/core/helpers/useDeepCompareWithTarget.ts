import type { DependencyList, EffectCallback } from 'react'
import { useRef } from 'react'
import { isEqual } from '@rcuse/shared'
import type { BasicTarget } from '@rcuse/shared'
import { useEffectWithTarget } from './useEffectWithTarget'

export function useDeepCompareEffectWithTarget(effect: EffectCallback, deps: DependencyList, target: BasicTarget<any> | BasicTarget<any>[]) {
  const ref = useRef<DependencyList>()
  const signalRef = useRef<number>(0)

  if (!isEqual(deps, ref.current)) {
    ref.current = deps
    signalRef.current += 1
  }

  useEffectWithTarget(effect, [signalRef.current], target)
}
