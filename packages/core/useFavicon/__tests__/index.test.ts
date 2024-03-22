import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useFavicon } from '../index'

describe('useFavicon', () => {
  it('should be defined', () => {
    expect(useFavicon).toBeDefined()
  })

  it('should set the favicon', () => {
    expect(document.querySelector('link[rel*=\'icon\']')).toBeNull()
    renderHook(() => useFavicon('favicon.ico'))
    expect(document.querySelector('link[rel*=\'icon\']')).not.toBeNull()
  })

  it('should support svg/png/ico/gif', () => {
    const { rerender } = renderHook((url: string) => useFavicon(url))
    const imgTypeMap = {
      svg: 'image/svg+xml',
      ico: 'image/x-icon',
      gif: 'image/gif',
      png: 'image/png',
    }
    const suffixs: (keyof typeof imgTypeMap)[] = ['svg', 'png', 'ico', 'gif']

    suffixs.forEach((suffix) => {
      const url = `favicon.${suffix}`
      rerender(url)
      const link = document.querySelector('link[rel*=\'icon\']') as HTMLLinkElement
      expect(link).toHaveAttribute('type', imgTypeMap[suffix])
      expect(link).toHaveAttribute('href', url)
      expect(link).toHaveAttribute('rel', 'shortcut icon')
    })
  })
})
