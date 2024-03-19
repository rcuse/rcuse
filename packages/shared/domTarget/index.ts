import type React from 'react'
import { isFunction } from 'radash'
import { isClient } from '../utils'

type TargetValue<T> = T | undefined | null
type TargetType = HTMLElement | Element | Window | Document

export type BasicTarget<T extends TargetType = Element> =
  | (() => TargetValue<T>)
  | TargetValue<T>
  | React.MutableRefObject<TargetValue<T>>

export function getTargetElement<T extends TargetType>(target: BasicTarget<T>, defaultElement?: T) {
  if (!isClient)
    return undefined

  if (!target)
    return defaultElement

  let targetElement: TargetValue<T>

  if (isFunction(target))
    targetElement = target()
  else if ('current' in target)
    targetElement = target.current
  else
    targetElement = target

  return targetElement
}
