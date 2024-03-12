import { beforeEach } from 'vitest'

import '@testing-library/jest-dom/vitest'
import './polyfillFetch'
import './polyfillPointerEvents'
import './polyfillIndexedDb'
import './polyfillMatchMedia'

const screenfullMethods = [
  'requestFullscreen',
  'exitFullscreen',
  'fullscreenElement',
  'fullscreenEnabled',
  'fullscreenchange',
  'fullscreenerror',
]

screenfullMethods.forEach((item) => {
  // @ts-expect-error @ts-expect-error
  document[item] = () => {}
  // @ts-expect-error @ts-expect-error
  HTMLElement.prototype[item] = () => {}
})

beforeEach(() => {
  document.body.innerHTML = ''
  document.head.innerHTML = ''
})
