import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeAll, describe, expect, it } from 'vitest'
import { scrollbarWidth } from '@pansy/scrollbar-width'

// @ts-expect-error 该库未提供类型定义
import { replaceRaf } from 'raf-stub'
import { useScrollbarWidth } from '../'

declare let requestAnimationFrame: {
  add: (cb: Function) => number
  remove: (id: number) => void
  flush: (duration?: number) => void
  reset: () => void
  step: (steps?: number, duration?: number) => void
}

describe('useScrollbarWidth', () => {
  beforeAll(() => {
    replaceRaf()
  })

  afterEach(() => {
    requestAnimationFrame.reset()
  })

  it('should be defined', () => {
    expect(useScrollbarWidth).toBeDefined()
  })

  it('should return value of scrollbarWidth result', () => {
    scrollbarWidth.__cache = 21
    const { result } = renderHook(() => useScrollbarWidth())

    expect(result.current).toBe(21)
  })

  it('should re-call scrollbar width in RAF in case `scrollbarWidth()` returned undefined', () => {
    scrollbarWidth.__cache = undefined
    const { result } = renderHook(() => useScrollbarWidth())
    expect(result.current).toBe(undefined)
    scrollbarWidth.__cache = 34
    act(() => {
      requestAnimationFrame.step()
    })

    expect(result.current).toBe(34)
  })
})
