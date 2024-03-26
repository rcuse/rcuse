import { act, renderHook } from '@testing-library/react'
import * as shared from '@rcuse/shared'
import { afterAll, describe, expect, it, vi } from 'vitest'
import { useDocumentVisibility } from '../index'

const mockIsBrowser = vi.spyOn(shared, 'isClient', 'get')
const mockDocumentVisibilityState = vi.spyOn(document, 'visibilityState', 'get')

afterAll(() => {
  vi.clearAllMocks()
})

describe('useDocumentVisibility', () => {
  it('should be defined', () => {
    expect(useDocumentVisibility).toBeDefined()
  })

  it('isBrowser effect corrent', async () => {
    mockDocumentVisibilityState.mockReturnValue('hidden')
    mockIsBrowser.mockReturnValue(false)

    const { result } = renderHook(() => useDocumentVisibility())

    expect(result.current).toBe('visible')
  })

  it('visibilitychange update correct ', async () => {
    mockDocumentVisibilityState.mockReturnValue('hidden')
    mockIsBrowser.mockReturnValue(true)
    const { result } = renderHook(() => useDocumentVisibility())
    expect(result.current).toBe('hidden')

    mockDocumentVisibilityState.mockReturnValue('visible')
    act(() => {
      document.dispatchEvent(new Event('visibilitychange'))
    })
    expect(result.current).toBe('visible')
  })
})
