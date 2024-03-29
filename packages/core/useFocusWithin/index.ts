import { useState } from 'react'
import type { BasicTarget } from '@rcuse/shared'
import { useEventListener } from '../useEventListener'

export interface UseFocusWithinOptions {
  onFocus?: (e: FocusEvent) => void
  onBlur?: (e: FocusEvent) => void
  onChange?: (isFocusWithin: boolean) => void
}

export default function useFocusWithin(target: BasicTarget, options?: UseFocusWithinOptions) {
  const [isFocusWithin, setIsFocusWithin] = useState(false)
  const { onFocus, onBlur, onChange } = options || {}

  useEventListener(
    'focusin',
    (e: FocusEvent) => {
      if (!isFocusWithin) {
        onFocus?.(e)
        onChange?.(true)
        setIsFocusWithin(true)
      }
    },
    {
      target,
    },
  )

  useEventListener(
    'focusout',
    (e: FocusEvent) => {
      if (isFocusWithin && !(e.currentTarget as Element)?.contains?.(e.relatedTarget as Element)) {
        onBlur?.(e)
        onChange?.(false)
        setIsFocusWithin(false)
      }
    },
    {
      target,
    },
  )

  return isFocusWithin
}
