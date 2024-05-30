import { getTargetElement } from '@rcuse/shared'
import type { BasicTarget } from '@rcuse/shared'
import { useLatest } from '../useLatest'
import { useDeepCompareEffectWithTarget } from '../helpers/useDeepCompareWithTarget'

export function useMutationObserver(callback: MutationCallback, target: BasicTarget, options: MutationObserverInit = {}): void {
  const callbackRef = useLatest(callback)

  useDeepCompareEffectWithTarget(
    () => {
      const element = getTargetElement(target)
      if (!element)
        return

      const observer = new MutationObserver(callbackRef.current)
      observer.observe(element, options)
      return () => {
        observer?.disconnect()
      }
    },
    [options],
    target,
  )
}
