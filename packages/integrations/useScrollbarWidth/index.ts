import { scrollbarWidth } from '@pansy/scrollbar-width'
import { useEffect, useState } from 'react'

export function useScrollbarWidth(): number | undefined {
  const [sbw, setSbw] = useState(scrollbarWidth())

  useEffect(() => {
    if (typeof sbw !== 'undefined')
      return

    const raf = requestAnimationFrame(() => {
      setSbw(scrollbarWidth())
    })

    return () => cancelAnimationFrame(raf)
  }, [])

  return sbw
}
