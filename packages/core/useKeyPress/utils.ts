import { isFunction, isNumber, isString } from '@rcuse/shared'
import { aliasKeyCodeMap } from './config'
import type { KeyEvent, KeyFilter, KeyPredicate, KeyType, Target } from './types'

export interface Options {
  events?: KeyEvent[]
  target?: Target
  exactMatch?: boolean
  useCapture?: boolean
}

// 修饰键
const modifierKey = {
  ctrl: (event: KeyboardEvent) => event.ctrlKey,
  shift: (event: KeyboardEvent) => event.shiftKey,
  alt: (event: KeyboardEvent) => event.altKey,
  meta: (event: KeyboardEvent) => {
    if (event.type === 'keyup')
      return aliasKeyCodeMap.meta.includes(event.keyCode)

    return event.metaKey
  },
}

type ModifierKey = keyof (typeof modifierKey)

// 判断合法的按键类型
export function isValidKeyType(value: unknown): value is string | number {
  return isString(value) || isNumber(value)
}

// 根据 event 计算激活键数量
export function countKeyByEvent(event: KeyboardEvent) {
  const countOfModifier = (Object.keys(modifierKey) as ModifierKey[])
    .reduce((total, key) => {
      if (modifierKey[key](event))
        return total + 1

      return total
    }, 0)

  // 16 17 18 91 92 是修饰键的 keyCode，如果 keyCode 是修饰键，那么激活数量就是修饰键的数量，如果不是，那么就需要 +1
  return [16, 17, 18, 91, 92].includes(event.keyCode) ? countOfModifier : countOfModifier + 1
}

/**
 * 判断按键是否激活
 * @param [event: KeyboardEvent]键盘事件
 * @param [keyFilter: any] 当前键
 * @returns string | number | boolean
 */
export function genFilterKey(event: KeyboardEvent, keyFilter: KeyType, exactMatch: boolean) {
  // 浏览器自动补全 input 的时候，会触发 keyDown、keyUp 事件，但此时 event.key 等为空
  if (!event.key)
    return false

  // 数字类型直接匹配事件的 keyCode
  if (isNumber(keyFilter))
    return event.keyCode === keyFilter ? keyFilter : false

  // 字符串依次判断是否有组合键
  const genArr = keyFilter.split('.')
  let genLen = 0

  for (const key of genArr) {
    // 组合键
    const genModifier = modifierKey[key as ModifierKey]
    // keyCode 别名
    const aliasKeyCode: number | number[] = (aliasKeyCodeMap as any)[key.toLowerCase()]

    if ((genModifier && genModifier(event)) || (aliasKeyCode && aliasKeyCode === event.keyCode))
      genLen++
  }

  /**
   * 需要判断触发的键位和监听的键位完全一致，判断方法就是触发的键位里有且等于监听的键位
   * genLen === genArr.length 能判断出来触发的键位里有监听的键位
   * countKeyByEvent(event) === genArr.length 判断出来触发的键位数量里有且等于监听的键位数量
   * 主要用来防止按组合键其子集也会触发的情况，例如监听 ctrl+a 会触发监听 ctrl 和 a 两个键的事件。
   */
  if (exactMatch)
    return genLen === genArr.length && countKeyByEvent(event) === genArr.length ? keyFilter : false

  return genLen === genArr.length ? keyFilter : false
}

/**
 * 键盘输入预处理方法
 * @param [keyFilter: any] 当前键
 * @returns () => Boolean
 */
export function genKeyFormatter(keyFilter: KeyFilter, exactMatch: boolean): KeyPredicate {
  if (isFunction(keyFilter))
    return keyFilter

  if (isValidKeyType(keyFilter))
    return (event: KeyboardEvent) => genFilterKey(event, keyFilter as KeyType, exactMatch)

  if (Array.isArray(keyFilter)) {
    return (event: KeyboardEvent) =>
      keyFilter.find(item => genFilterKey(event, item, exactMatch))
  }
  return () => Boolean(keyFilter)
}
