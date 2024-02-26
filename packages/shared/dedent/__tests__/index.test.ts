import { describe, it, expect } from 'vitest'
import { dedent } from '../../dedent'
import { indent } from '../../indent'

describe('dedent', () => {
  it('空字符串正常', () => {
    expect(dedent``).toBe('')
  })

  it('单行字符串', () => {
    expect(dedent`hello`).toBe('hello')
  })

  it('有缩进的多行字符串', () => {
    expect(dedent` hello\n  world`).toBe('hello\n world')
  })

  it('首尾存在换行符的多行字符串', () => {
    expect(dedent`
      ${'  '}
      hello

      world
        ---

    `).toBe('hello\n\nworld\n  ---')
  })

  it('通过函数调用正常', () => {
    expect(
      dedent(`
        a
        b
      `),
    ).toBe('a\nb')
    expect(dedent('')).toBe('')
  })
})
