import type React from 'react'
import { useCallback, useEffect, useState } from 'react'
import { createPortal, unmountComponentAtNode } from 'react-dom'

interface Portal {
  render: (props: { children: React.ReactNode }) => React.ReactPortal | null
  remove: (elm?: HTMLElement) => void
}

export function usePortal() {
  const [container] = useState<HTMLDivElement>(() => {
    return document.createElement('div')
  })

  const [portal, setPortal] = useState<Portal>({
    render: () => null,
    remove: () => null,
  })

  const ReactCreatePortal = useCallback<(elmm: HTMLDivElement) => Portal>((elmm) => {
    const Portal: Portal['render'] = ({ children }) => {
      if (!children)
        return null
      return createPortal(children, elmm)
    }
    const remove: Portal['remove'] = (elm) => {
      elm && unmountComponentAtNode(elm)
    }
    return { render: Portal, remove }
  }, [])

  useEffect(() => {
    if (container)
      portal.remove()
    const newPortal = ReactCreatePortal(container)
    setPortal(newPortal)
    return () => {
      newPortal.remove(container)
    }
  }, [container])

  return { Portal: portal.render, container }
}
