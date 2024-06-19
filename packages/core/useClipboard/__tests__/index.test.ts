import { describe, expect, it } from 'vitest'
import { useClipboard } from '../index'

describe('useCopyToClipboard', () => {
  it('should be defined ', () => {
    expect(useClipboard).toBeDefined()
  })
})
