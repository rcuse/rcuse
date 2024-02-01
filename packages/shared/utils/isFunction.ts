/** 判断值是否为一个方法 */
export const isFunction = <T extends Function>(val: any): val is T => typeof val === 'function';
