import { describe, expect, it } from 'vitest'
import { useBeforeUnload } from '../index'

describe('useBeforeUnload', () => {
  it('should be defined', () => {
    expect(useBeforeUnload).toBeDefined()
  })
})
