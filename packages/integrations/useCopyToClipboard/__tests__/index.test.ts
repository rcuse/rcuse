import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useCopyToClipboard } from '../index'

const valueToRaiseMockException = 'fake input causing exception in copy to clipboard'

vi.mock('@pansy/copy-to-clipboard', () => {
  return vi.fn().mockImplementation((input) => {
    if (input === valueToRaiseMockException)
      throw new Error(input)

    return true
  })
})

describe('useCopyToClipboard', () => {
  let hook: any
  // eslint-disable-next-line no-restricted-globals
  const consoleErrorSpy = vi.spyOn(global.console, 'error').mockImplementation(() => {})

  beforeEach(() => {
    hook = renderHook(() => useCopyToClipboard())
  })

  afterAll(() => {
    consoleErrorSpy.mockRestore()
    vi.unmock('@pansy/copy-to-clipboard')
  })

  it('should be defined ', () => {
    expect(useCopyToClipboard).toBeDefined()
  })

  it('should pass a given value to copy to clipboard and set state', () => {
    const testValue = 'test'
    let [state, copyToClipboard] = hook.result.current
    act(() => copyToClipboard(testValue));
    [state, copyToClipboard] = hook.result.current

    expect(state.value).toBe(testValue)
    expect(state.noUserInteraction).toBe(false)
    expect(state.error).toBeUndefined()
  })
})
