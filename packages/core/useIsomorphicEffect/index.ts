import { useEffect, useLayoutEffect } from 'react'
import { isClient } from '@rcuse/core'

/**
 * On the server, React emits a warning when calling `useLayoutEffect`.
 * This is because neither `useLayoutEffect` nor `useEffect` run on the server.
 * We use this safe version which suppresses the warning by replacing it with a noop on the server.
 *
 * See: https://reactjs.org/docs/hooks-reference.html#uselayouteffect
 */
export const useIsomorphicEffect = isClient ? useLayoutEffect : useEffect
