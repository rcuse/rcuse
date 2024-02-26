import { beforeEach } from 'vitest'

import '@testing-library/jest-dom/vitest'
import './polyfillFetch'
import './polyfillPointerEvents'
import './polyfillIndexedDb'
import './polyfillMatchMedia'

beforeEach(() => {
  document.body.innerHTML = ''
  document.head.innerHTML = ''
})
