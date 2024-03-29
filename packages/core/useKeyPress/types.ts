import type { BasicTarget } from '@rcuse/shared'

export type KeyType = number | string
export type KeyPredicate = (event: KeyboardEvent) => KeyType | boolean | undefined
export type KeyFilter = KeyType | KeyType[] | ((event: KeyboardEvent) => boolean)
export type KeyEvent = 'keydown' | 'keyup'

export type Target = BasicTarget<HTMLElement | Document | Window>

export interface Options {
  events?: KeyEvent[]
  target?: Target
  exactMatch?: boolean
  useCapture?: boolean
}
