import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useValidatedState } from '../index'

describe('useValidatedState', () => {
  it('should be defined', () => {
    expect(useValidatedState).toBeDefined()
  })

  it('returns initial value', () => {
    const hookValid = renderHook(() => useValidatedState('test', val => val === 'test'))
    expect(hookValid.result.current[0].lastValidValue).toBe('test')
    expect(hookValid.result.current[0].valid).toBe(true)
    expect(hookValid.result.current[0].value).toBe('test')
    expect(typeof hookValid.result.current[1]).toBe('function')

    const hookInvalid = renderHook(() => useValidatedState('test', val => val === 'tests'))
    expect(hookInvalid.result.current[0].lastValidValue).toBe(undefined)
    expect(hookInvalid.result.current[0].valid).toBe(false)
    expect(hookInvalid.result.current[0].value).toBe('test')
    expect(typeof hookInvalid.result.current[1]).toBe('function')
  })

  it('returns correct value based on the rule', () => {
    const hook = renderHook(() => useValidatedState('test', val => val === 'test'))
    expect(hook.result.current[0].lastValidValue).toBe('test')
    expect(hook.result.current[0].valid).toBe(true)
    expect(hook.result.current[0].value).toBe('test')
    act(() => {
      hook.result.current[1]('tests')
    })
    expect(hook.result.current[0].lastValidValue).toBe('test')
    expect(hook.result.current[0].valid).toBe(false)
    expect(hook.result.current[0].value).toBe('tests')
  })
})
