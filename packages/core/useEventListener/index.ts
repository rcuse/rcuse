import { getTargetElement } from '@rcuse/shared'
import type { BasicTarget } from '@rcuse/shared'
import { useLatest } from '../useLatest'
import { useEffectWithTarget } from '../helpers/useEffectWithTarget'

type noop = (...p: any) => void
type Target = BasicTarget<HTMLElement | Element | Window | Document>
interface Options<T extends Target = Target> {
  target?: T
  capture?: boolean
  once?: boolean
  passive?: boolean
  enable?: boolean
}

export function useEventListener<K extends keyof HTMLElementEventMap>(
  eventName: K,
  handler: (ev: HTMLElementEventMap[K]) => void,
  options?: Options<HTMLElement>,
): void
export function useEventListener<K extends keyof ElementEventMap>(
  eventName: K,
  handler: (ev: ElementEventMap[K]) => void,
  options?: Options<Element>,
): void
export function useEventListener<K extends keyof DocumentEventMap>(
  eventName: K,
  handler: (ev: DocumentEventMap[K]) => void,
  options?: Options<Document>,
): void
export function useEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  handler: (ev: WindowEventMap[K]) => void,
  options?: Options<Window>,
): void
export function useEventListener(eventName: string, handler: noop, options: Options): void

export function useEventListener(eventName: string, handler: noop, options: Options = {}) {
  const { enable = true } = options

  const handlerRef = useLatest(handler)

  useEffectWithTarget(
    () => {
      if (!enable)
        return

      const targetElement = getTargetElement(options.target, window)
      if (!targetElement?.addEventListener)
        return

      const eventListener = (event: Event) => {
        return handlerRef.current(event)
      }

      targetElement.addEventListener(eventName, eventListener, {
        capture: options.capture,
        once: options.once,
        passive: options.passive,
      })

      return () => {
        targetElement.removeEventListener(eventName, eventListener, {
          capture: options.capture,
        })
      }
    },
    [eventName, options.capture, options.once, options.passive, enable],
    options.target,
  )
}
