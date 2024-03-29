import { renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useLongPress } from '../index'

import type { EventType, UseLongPressOptions } from '../types'

let events: Record<string, any> = {}
const mockTarget = {
  addEventListener: vi.fn((event, callback) => {
    events[event] = callback
  }),
  removeEventListener: vi.fn((event) => {
    Reflect.deleteProperty(events, event)
  }),
}

const mockCallback = vi.fn()
const mockClickCallback = vi.fn()
const mockLongPressEndCallback = vi.fn()

function setup(onLongPress: (
  event: EventType) => void, target: any, options?: UseLongPressOptions) {
  return renderHook(() => useLongPress(onLongPress, target, options))
}

describe('useLongPress', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
  })

  afterEach(() => {
    events = {}
    vi.useRealTimers()
  })

  it('should be defined', () => {
    expect(useLongPress).toBeDefined()
  })

  it('longPress callback correct', () => {
    setup(mockCallback, mockTarget, {
      onClick: mockClickCallback,
      onLongPressEnd: mockLongPressEndCallback,
    })

    expect(mockTarget.addEventListener).toBeCalled()

    events.touchstart()
    vi.advanceTimersByTime(350)
    events.touchend()

    expect(mockCallback).toBeCalledTimes(1)
    expect(mockLongPressEndCallback).toBeCalledTimes(1)
    expect(mockClickCallback).toBeCalledTimes(0)
  })

  it('click callback correct', () => {
    setup(mockCallback, mockTarget, {
      onClick: mockClickCallback,
      onLongPressEnd: mockLongPressEndCallback,
    })

    expect(mockTarget.addEventListener).toBeCalled()
    events.touchstart()
    events.touchend()
    events.touchstart()
    events.touchend()
    expect(mockCallback).toBeCalledTimes(0)
    expect(mockLongPressEndCallback).toBeCalledTimes(0)
    expect(mockClickCallback).toBeCalledTimes(2)
  })

  it('longPress and click callback correct', () => {
    setup(mockCallback, mockTarget, {
      onClick: mockClickCallback,
      onLongPressEnd: mockLongPressEndCallback,
    })
    expect(mockTarget.addEventListener).toBeCalled()
    events.touchstart()
    vi.advanceTimersByTime(350)
    events.touchend()
    events.touchstart()
    events.touchend()
    expect(mockCallback).toBeCalledTimes(1)
    expect(mockLongPressEndCallback).toBeCalledTimes(1)
    expect(mockClickCallback).toBeCalledTimes(1)
  })

  it('onLongPress should not be called when over the threshold', () => {
    const { unmount } = setup(mockCallback, mockTarget, {
      moveThreshold: {
        x: 30,
        y: 20,
      },
    })
    expect(events.touchmove).toBeDefined()
    events.touchstart(new MouseEvent('touchstart'))
    events.touchmove(
      new MouseEvent('touchmove', {
        clientX: 40,
        clientY: 10,
      }),
    )
    vi.advanceTimersByTime(320)
    expect(mockCallback).not.toBeCalled()

    unmount()
    expect(events.mousemove).toBeUndefined()
  })

  it(`should not work when target don't support addEventListener method`, () => {
    Object.defineProperty(mockTarget, 'addEventListener', {
      get() {
        return false
      },
    })

    setup(() => {}, mockTarget)
    expect(Object.keys(events)).toHaveLength(0)
  })
})
