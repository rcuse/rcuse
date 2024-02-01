/**
 * 判断是否为浏览器
 */
export const isClient = typeof window !== 'undefined' && typeof document !== 'undefined'

/**
 * 判断值是否为一个方法
 * @param val
 * @returns
 */
export const isFunction = <T extends Function>(val: any): val is T => typeof val === 'function';
