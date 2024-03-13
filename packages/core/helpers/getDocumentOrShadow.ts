import { getTargetElement } from '@rcuse/core'

import type { BasicTarget } from '@rcuse/core'

declare type TargetValue<T> = T | undefined | null

function checkIfAllInShadow(targets: BasicTarget[]): boolean {
  return targets.every((item) => {
    const targetElement = getTargetElement(item)
    if (!targetElement)
      return false
    if (targetElement.getRootNode() instanceof ShadowRoot)
      return true

    return false
  })
}

function getShadow(node: TargetValue<Element>) {
  if (!node)
    return document

  return node.getRootNode()
}

export function getDocumentOrShadow(target: BasicTarget | BasicTarget[]): Document | Node {
  if (!target || !document.getRootNode)
    return document

  const targets = Array.isArray(target) ? target : [target]

  if (checkIfAllInShadow(targets))
    return getShadow(getTargetElement(targets[0]))

  return document
}
