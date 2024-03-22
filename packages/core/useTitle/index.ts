import { useEffect, useRef } from 'react'
import { isClient } from '@rcuse/shared'
import { useUnmount } from '../useUnmount'

export interface UseTitleOptions {
  restoreOnUnmount?: boolean
}

const DEFAULT_USE_TITLE_OPTIONS: UseTitleOptions = {
  restoreOnUnmount: false,
}

export function useTitle(title: string, options: UseTitleOptions = DEFAULT_USE_TITLE_OPTIONS) {
  const titleRef = useRef(isClient ? document.title : '')

  useEffect(() => {
    document.title = title
  }, [title])

  useUnmount(() => {
    if (options.restoreOnUnmount)
      document.title = titleRef.current
  })
}
