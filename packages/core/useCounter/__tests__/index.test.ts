import { act, renderHook } from '@testing-library/react'
import { expect, it } from 'vitest'
import { useCounter } from '../index'

interface Options {
  min?: number
  max?: number
}

const setUp = (init?: number, options?: Options) => renderHook(() => useCounter(init, options))

it('should init counter', () => {
  const { result } = setUp(100)
  const [current] = result.current
  expect(current).toBe(100)
})

it('should max, min, actions work', () => {
  const { result } = setUp(100, { max: 10, min: 1 })
  const [current, { increment, decrement, reset, set }] = result.current
  expect(current).toBe(10)
  act(() => {
    increment(1)
  })
  expect(result.current[0]).toBe(10)
  act(() => {
    decrement(100)
  })
  expect(result.current[0]).toBe(1)
  act(() => {
    increment()
  })
  expect(result.current[0]).toBe(2)
  act(() => {
    reset()
  })
  expect(result.current[0]).toBe(10)
  act(() => {
    set(-1000)
  })
  expect(result.current[0]).toBe(1)
  act(() => {
    set(c => c + 2)
  })
  expect(result.current[0]).toBe(3)

  act(() => {
    increment()
    increment()
    increment()
  })
  expect(result.current[0]).toBe(6)
})
