import { useState } from 'react'
import { isClient } from '@rcuse/shared'
import { useEventListener } from '../useEventListener'

type VisibilityState = 'hidden' | 'visible' | 'prerender' | undefined

function getVisibility() {
  if (!isClient)
    return 'visible'

  return document.visibilityState
}

export function useDocumentVisibility(): VisibilityState {
  const [documentVisibility, setDocumentVisibility] = useState(getVisibility)

  useEventListener(
    'visibilitychange',
    () => {
      setDocumentVisibility(getVisibility())
    },
    {
      target: () => document,
    },
  )

  return documentVisibility
}
