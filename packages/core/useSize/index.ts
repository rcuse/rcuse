import { trackElementSize } from '@zag-js/element-size'
import type { BasicTarget } from '@rcuse/shared'
import { getTargetElement } from '@rcuse/shared'
import { useRafState } from '../useRafState'
import { useIsomorphicLayoutEffectWithTarget } from '../helpers/useIsomorphicLayoutEffectWithTarget'

interface Size { width: number, height: number }

export function useSize(target: BasicTarget): Size | undefined {
  const [state, setState] = useRafState<Size | undefined>(
    () => {
      const el = getTargetElement(target)
      return el ? { width: el.clientWidth, height: el.clientHeight } : undefined
    },
  )

  useIsomorphicLayoutEffectWithTarget(
    () => {
      const el = getTargetElement(target) as HTMLElement

      if (!el)
        return

      const cleanup = trackElementSize(el, (size) => {
        setState(size)
      })

      return () => {
        cleanup?.()
      }
    },
    [],
    target,
  )

  return state
}
