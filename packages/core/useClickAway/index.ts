import type React from 'react'
import { getTargetElement } from '@rcuse/shared'
import type { BasicTarget } from '@rcuse/shared'
import { useLatest } from '../useLatest'
import { getDocumentOrShadow } from '../helpers/getDocumentOrShadow'
import { useEffectWithTarget } from '../helpers/useEffectWithTarget'

type DocumentEventKey = keyof DocumentEventMap

export function useClickAway<T extends Event = Event>(
  onClickAway: (event: T) => void,
  target: BasicTarget | BasicTarget[],
  eventName: DocumentEventKey | DocumentEventKey[] = 'click',
) {
  const onClickAwayRef = useLatest(onClickAway)

  useEffectWithTarget(
    () => {
      const handler = (event: any) => {
        const targets = Array.isArray(target) ? target : [target]
        if (
          targets.some((item) => {
            const targetElement = getTargetElement(item)
            return !targetElement || targetElement.contains(event.target)
          })
        )
          return

        onClickAwayRef.current(event)
      }

      const documentOrShadow = getDocumentOrShadow(target)

      const eventNames = Array.isArray(eventName) ? eventName : [eventName]

      eventNames.forEach(event => documentOrShadow.addEventListener(event, handler))

      return () => {
        eventNames.forEach(event => documentOrShadow.removeEventListener(event, handler))
      }
    },
    (Array.isArray(target) ? eventName : [eventName]) as React.DependencyList,
    target,
  )
}
