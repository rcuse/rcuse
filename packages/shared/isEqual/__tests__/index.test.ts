import { describe, expect, it } from 'vitest'
import { isEqual } from '../index'

describe('isEqual function', () => {
  it('should return true for two equal objects', () => {
    const obj1 = { name: 'John', age: 30, hobbies: ['reading', 'coding'] }
    const obj2 = { name: 'John', age: 30, hobbies: ['reading', 'coding'] }

    expect(isEqual(obj1, obj2)).toBe(true)
  })

  it('should return false for two different objects', () => {
    const obj1 = { name: 'John', age: 30, hobbies: ['reading', 'coding'] }
    const obj2 = { name: 'Jane', age: 28, hobbies: ['running', 'swimming'] }

    expect(isEqual(obj1, obj2)).toBe(false)
  })

  it('should return true for two equal arrays', () => {
    const arr1 = [1, 2, { name: 'John', age: 30 }]
    const arr2 = [1, 2, { name: 'John', age: 30 }]
    expect(isEqual(arr1, arr2)).toBe(true)
  })

  it('should return false for two different arrays', () => {
    const arr1 = [1, 2, { name: 'John', age: 30 }]
    const arr2 = [1, 2, { name: 'Jane', age: 28 }]
    expect(isEqual(arr1, arr2)).toBe(false)
  })

  it('should handle circular references correctly', () => {
    const obj1: any = { name: 'John' }
    obj1.obj = obj1
    const obj2: any = { name: 'John' }
    obj2.obj = obj2
    expect(isEqual(obj1, obj2)).toBe(false)
  })

  it('should handle shallow comparison correctly', () => {
    const obj1 = { name: 'John', age: 30, hobbies: ['reading', 'coding'] }
    const obj2 = { name: 'John', age: 30, hobbies: ['reading', 'coding'] }
    expect(isEqual(obj1, obj2, true)).toBe(false)
  })
})
