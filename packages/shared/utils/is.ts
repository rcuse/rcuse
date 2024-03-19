/**
 * 判断是否为浏览器
 */
export const isClient = typeof window !== 'undefined' && typeof document !== 'undefined'

export const isNavigator = typeof navigator !== 'undefined'

/**
 * 检查 `value` 是否是 `undefined`
 *
 * @param value 要检查的值
 * @returns `value` 是 `undefined` 返回 `true`，否则返回 `false`
 * @example
 * ```ts
 * isUndefined(undefined) // => true
 * ```
 */
export function isUndefined(value: any): value is undefined {
  return value === undefined
}

/**
 * 判断值是否为一个布尔值
 * @param val
 * @returns
 */
export const isBoolean = (value: unknown): value is boolean => typeof value === 'boolean'
