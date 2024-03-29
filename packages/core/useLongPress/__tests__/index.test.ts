import { renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { BasicTarget } from '@rcuse/core'
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
  event: EventType) => void, target: BasicTarget, options?: UseLongPressOptions) {
  return renderHook(() => useLongPress(onLongPress, target, options))
}

describe('useLongPress', () => {
  beforeEach(() => {
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
    setup(mockCallback, mockTarget as unknown as BasicTarget, {
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
})
