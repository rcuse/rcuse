import { isClient } from '@rcuse/shared'
import { useEffectWithTarget } from './useEffectWithTarget'
import { useLayoutEffectWithTarget } from './useLayoutEffectWithTarget'

export const useIsomorphicLayoutEffectWithTarget = isClient
  ? useLayoutEffectWithTarget
  : useEffectWithTarget
