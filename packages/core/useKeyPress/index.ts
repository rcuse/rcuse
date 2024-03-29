import { getTargetElement } from '@rcuse/shared'
import { useLatest } from '../useLatest'
import { useDeepCompareEffectWithTarget } from '../helpers/useDeepCompareWithTarget'
import { genKeyFormatter, isValidKeyType } from './utils'

import type { KeyEvent, KeyFilter, Options } from './types'

const defaultEvents: KeyEvent[] = ['keydown']

export function useKeyPress(
  keyFilter: KeyFilter,
  eventHandler: (event: KeyboardEvent, key: KeyType) => void,
  option?: Options,
) {
  const { events = defaultEvents, target, exactMatch = false, useCapture = false } = option || {}
  const eventHandlerRef = useLatest(eventHandler)
  const keyFilterRef = useLatest(keyFilter)

  useDeepCompareEffectWithTarget(
    () => {
      const el = getTargetElement(target, window)
      if (!el)
        return

      const callbackHandler = (event: KeyboardEvent) => {
        const genGuard = genKeyFormatter(keyFilterRef.current, exactMatch)
        const keyGuard = genGuard(event)
        const firedKey = isValidKeyType(keyGuard) ? keyGuard : event.key

        if (keyGuard)
          return eventHandlerRef.current?.(event, firedKey as KeyType)
      }

      for (const eventName of events)
        el?.addEventListener?.(eventName, callbackHandler as any, useCapture)

      return () => {
        for (const eventName of events)
          el?.removeEventListener?.(eventName, callbackHandler as any, useCapture)
      }
    },
    [events],
    target,
  )
}
