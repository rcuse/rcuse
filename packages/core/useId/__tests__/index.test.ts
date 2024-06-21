import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useId } from '../index'

describe('useId', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  it('returns static id', () => {
    const view = renderHook(() => useId('test-id'))
    expect(view.result.current).toBe('test-id')
  })

  it('returns random id if static id is not provided', () => {
    const view = renderHook(() => useId())
    expect(typeof view.result.current).toBe('string')
    expect(view.result.current.includes('rcuse')).toBe(true)
    expect(view.result.current !== renderHook(() => useId()).result.current).toBe(true)
  })
})
