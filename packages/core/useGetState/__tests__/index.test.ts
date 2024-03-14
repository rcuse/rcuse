import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useGetState } from '../index'

function setUp<T>(initialValue: T) {
  return renderHook(() => {
    const [state, setState, getState] = useGetState<T>(initialValue)
    return {
      state,
      setState,
      getState,
    } as const
  })
}

describe('useGetState', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.clearAllTimers()
  })

  it('should be defined', () => {
    expect(useGetState).toBeDefined()
  })

  it('should support initialValue', () => {
    const hook = setUp(() => 0)
    expect(hook.result.current.state).toBe(0)
  })

  it('should init getter and setter', () => {
    const { result } = setUp('foo')
    const { getState, setState } = result.current

    expect(getState).toBeInstanceOf(Function)
    expect(setState).toBeInstanceOf(Function)
  })

  it('should support update', () => {
    const hook = setUp(0)
    act(() => {
      hook.result.current.setState(1)
    })
    expect(hook.result.current.getState()).toBe(1)
  })

  it('should getState frozen', () => {
    const hook = setUp(0)
    const prevGetState = hook.result.current.getState
    act(() => {
      hook.result.current.setState(1)
    })
    expect(hook.result.current.getState).toBe(prevGetState)
  })

  it('should get and set expected values when used in nested functions', () => {
    const { result } = setUp(0)
    const { getState, setState } = result.current

    const onClick = vi.fn(() => {
      setTimeout(() => {
        setState(getState() + 1)
      }, 1000)
    })

    // simulate 3 clicks
    onClick()
    onClick()
    onClick()

    // fast-forward until all timers have been executed
    act(() => {
      vi.runAllTimers()
    })

    const currentValue = getState()
    expect(currentValue).toBe(3)
    expect(onClick).toHaveBeenCalledTimes(3)
  })
})
