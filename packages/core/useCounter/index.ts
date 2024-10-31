import { useState } from 'react'
import { isNumber } from 'es-toolkit/compat'
import { useMemoizedFn } from '../useMemoizedFn'

interface Options {
  min?: number
  max?: number
}

type ValueParam = number | ((c: number) => number)

function getTargetValue(val: number, options: Options = {}) {
  const { min, max } = options
  let target = val
  if (isNumber(max))
    target = Math.min(max, target)

  if (isNumber(min))
    target = Math.max(min, target)

  return target
}

export function useCounter(initialValue: number = 0, options: Options = {}) {
  const { min, max } = options

  const [current, setCurrent] = useState(() => {
    return getTargetValue(initialValue, {
      min,
      max,
    })
  })

  const setValue = (value: ValueParam) => {
    setCurrent((c) => {
      const target = isNumber(value) ? value : value(c)
      return getTargetValue(target, {
        max,
        min,
      })
    })
  }

  const increment = (delta: number = 1) => {
    setValue(c => c + delta)
  }

  const decrement = (delta: number = 1) => {
    setValue(c => c - delta)
  }

  const set = (value: ValueParam) => {
    setValue(value)
  }

  const reset = () => {
    setValue(initialValue)
  }

  return [
    current,
    {
      increment: useMemoizedFn(increment),
      decrement: useMemoizedFn(decrement),
      set: useMemoizedFn(set),
      reset: useMemoizedFn(reset),
    },
  ] as const
}
