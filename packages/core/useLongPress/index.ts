import { useRef } from 'react'
import { getTargetElement, isClient, off, on } from '@rcuse/shared'
import type { BasicTarget } from '@rcuse/core'
import { useLatest } from '../useLatest'
import { useEffectWithTarget } from '../helpers/useEffectWithTarget'

type EventType = MouseEvent | TouchEvent
export interface UseLongPressOptions {
  delay?: number
  moveThreshold?: { x?: number, y?: number }
  onClick?: (event: EventType) => void
  onLongPressEnd?: (event: EventType) => void
}

const touchSupported
  = isClient
  // @ts-expect-error ignore error
  && ('ontouchstart' in window || (window.DocumentTouch && document instanceof DocumentTouch))

export function useLongPress(
  onLongPress: (event: EventType) => void,
  target: BasicTarget,
  { delay = 300, moveThreshold, onClick, onLongPressEnd }: UseLongPressOptions = {},
) {
  const onLongPressRef = useLatest(onLongPress)
  const onClickRef = useLatest(onClick)
  const onLongPressEndRef = useLatest(onLongPressEnd)

  const timerRef = useRef<ReturnType<typeof setTimeout>>()
  const isTriggeredRef = useRef(false)
  const pervPositionRef = useRef({ x: 0, y: 0 })
  const hasMoveThreshold = !!(
    (moveThreshold?.x && moveThreshold.x > 0)
    || (moveThreshold?.y && moveThreshold.y > 0)
  )

  useEffectWithTarget(
    () => {
      const targetElement = getTargetElement(target)
      if (!targetElement?.addEventListener)
        return

      const overThreshold = (event: EventType) => {
        const { clientX, clientY } = getClientPosition(event)
        const offsetX = Math.abs(clientX - pervPositionRef.current.x)
        const offsetY = Math.abs(clientY - pervPositionRef.current.y)

        return !!(
          (moveThreshold?.x && offsetX > moveThreshold.x)
          || (moveThreshold?.y && offsetY > moveThreshold.y)
        )
      }

      function getClientPosition(event: EventType) {
        if (event instanceof TouchEvent) {
          return {
            clientX: event.touches[0].clientX,
            clientY: event.touches[0].clientY,
          }
        }

        if (event instanceof MouseEvent) {
          return {
            clientX: event.clientX,
            clientY: event.clientY,
          }
        }

        console.warn('Unsupported event type')

        return { clientX: 0, clientY: 0 }
      }

      const onStart = (event: EventType) => {
        if (hasMoveThreshold) {
          const { clientX, clientY } = getClientPosition(event)
          pervPositionRef.current.x = clientX
          pervPositionRef.current.y = clientY
        }
        timerRef.current = setTimeout(() => {
          onLongPressRef.current(event)
          isTriggeredRef.current = true
        }, delay)
      }

      const onMove = (event: TouchEvent) => {
        if (timerRef.current && overThreshold(event)) {
          clearTimeout(timerRef.current)
          timerRef.current = undefined
        }
      }

      const onEnd = (event: EventType, shouldTriggerClick: boolean = false) => {
        if (timerRef.current)
          clearTimeout(timerRef.current)

        if (isTriggeredRef.current)
          onLongPressEndRef.current?.(event)

        if (shouldTriggerClick && !isTriggeredRef.current && onClickRef.current)
          onClickRef.current(event)

        isTriggeredRef.current = false
      }

      const onEndWithClick = (event: EventType) => onEnd(event, true)

      if (!touchSupported) {
        on(targetElement, 'mousedown', onStart)
        on(targetElement, 'mouseup', onEndWithClick)
        on(targetElement, 'mouseleave', onEnd)
        if (hasMoveThreshold)
          on(targetElement, 'mousemove', onMove)
      }
      else {
        on(targetElement, 'touchstart', onStart)
        on(targetElement, 'touchstart', onEndWithClick)
        if (hasMoveThreshold)
          on(targetElement, 'touchmove', onMove)
      }
      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current)
          isTriggeredRef.current = false
        }
        if (!touchSupported) {
          off(targetElement, 'mousedown', onStart)
          off(targetElement, 'mouseup', onEndWithClick)
          off(targetElement, 'mouseleave', onEnd)
          if (hasMoveThreshold)
            off(targetElement, 'mousemove', onMove)
        }
        else {
          off(targetElement, 'touchstart', onStart)
          off(targetElement, 'touchend', onEndWithClick)
          if (hasMoveThreshold)
            off(targetElement, 'touchmove', onMove)
        }
      }
    },
    [],
    target,
  )
}
