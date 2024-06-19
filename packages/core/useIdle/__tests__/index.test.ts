import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useIdle } from '../index'

describe('useIdle', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  it('correct initial return value', () => {
    const hook = renderHook(() => useIdle(1000))
    expect(hook.result.current).toBe(true)
  })

  it('returns correct value on firing keypress event', () => {
    const hook = renderHook(() => useIdle(1000))

    expect(hook.result.current).toBe(true)
    act(() => {
      document.dispatchEvent(new KeyboardEvent('keypress'))
    })

    expect(hook.result.current).toBe(false)
    setTimeout(() => {
      expect(hook.result.current).toBe(true)
    }, 1001)
  })

  it('correct return value on mouse events', () => {
    const hook = renderHook(() => useIdle(1000))

    expect(hook.result.current).toBe(true)
    act(() => {
      document.dispatchEvent(new MouseEvent('mousemove'))
    })

    expect(hook.result.current).toBe(false)
    setTimeout(() => {
      expect(hook.result.current).toBe(true)
    }, 1001)
  })

  it('correct return value on touch events', () => {
    const hook = renderHook(() => useIdle(1000))
    expect(hook.result.current).toBe(true)

    act(() => {
      document.dispatchEvent(new MouseEvent('touchmove'))
    })
    expect(hook.result.current).toBe(false)

    setTimeout(() => {
      expect(hook.result.current).toBe(true)
    }, 1001)
  })

  it('correct return value on multiple consecutive events', () => {
    const hook = renderHook(() => useIdle(1000))
    expect(hook.result.current).toBe(true)

    act(() => {
      document.dispatchEvent(new TouchEvent('touchmove'))
    })
    expect(hook.result.current).toBe(false)

    setTimeout(() => {
      expect(hook.result.current).toBe(true)
    }, 1001)
    act(() => {
      document.dispatchEvent(new MouseEvent('mousemove'))
    })
    expect(hook.result.current).toBe(false)

    setTimeout(() => {
      expect(hook.result.current).toBe(true)
    }, 1001)
  })
})
