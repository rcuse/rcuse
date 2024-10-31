import type React from 'react'
import { useMemo, useRef } from 'react'
import { isFunction } from 'es-toolkit/predicate'
import { useMemoizedFn } from '../useMemoizedFn'
import { useUpdate } from '../useUpdate'

export type UseControllableValueProps = Record<string, any>

interface StandardProps<T> {
  value: T
  defaultValue?: T
  onChange: (val: T) => void
}

export interface UseControllableValueOptions<T> {
  defaultValue?: T
  defaultValuePropName?: string
  valuePropName?: string
  trigger?: string
}

export function useControllableValue<T = any>(
  props: StandardProps<T>
): [T, (v: React.SetStateAction<T>) => void]

export function useControllableValue<T = any>(
  props?: UseControllableValueProps,
  options?: UseControllableValueOptions<T>,
): [T, (v: React.SetStateAction<T>, ...args: any[]) => void]

export function useControllableValue<T = any>(
  props: UseControllableValueProps = {},
  options: UseControllableValueOptions<T> = {},
) {
  const {
    defaultValue,
    defaultValuePropName = 'defaultValue',
    valuePropName = 'value',
    trigger = 'onChange',
  } = options

  const value = props[valuePropName] as T
  const isControlled = valuePropName in props

  const initialValue = useMemo(
    () => {
      if (isControlled)
        return value

      if (defaultValuePropName in props)
        return props[defaultValuePropName]

      return defaultValue
    },
    [],
  )

  const stateRef = useRef(initialValue)
  if (isControlled)
    stateRef.current = value

  const update = useUpdate()

  const setState = (v: React.SetStateAction<T>, ...args: any[]) => {
    const r = isFunction(v) ? v(stateRef.current) : v

    if (!isControlled) {
      stateRef.current = r
      update()
    }

    if (props[trigger])
      props[trigger](r, ...args)
  }

  return [stateRef.current, useMemoizedFn(setState)] as const
}
