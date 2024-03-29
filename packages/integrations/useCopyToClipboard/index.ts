import { useCallback } from 'react'
import writeText from '@pansy/copy-to-clipboard'
import { isNumber, isString, useMountedState, useSetState } from '@rcuse/core'

interface CopyToClipboardState {
  value?: string
  noUserInteraction: boolean
  error?: Error
}

export function useCopyToClipboard(): [CopyToClipboardState, (value: string | number) => void] {
  const isMounted = useMountedState()

  const [state, setState] = useSetState<CopyToClipboardState>({
    value: undefined,
    error: undefined,
    noUserInteraction: true,
  })

  const copyToClipboard = useCallback((value: string | number) => {
    if (!isMounted())
      return

    let noUserInteraction
    let normalizedValue

    try {
      if (!isString(value) && !isNumber(value)) {
        const error = new Error(
          `Cannot copy typeof ${typeof value} to clipboard, must be a string`,
        )

        setState({
          value,
          error,
          noUserInteraction: true,
        })
        return
      }
      else if (value === '') {
        const error = new Error(`Cannot copy empty string to clipboard.`)
        setState({
          value,
          error,
          noUserInteraction: true,
        })
        return
      }

      normalizedValue = value.toString()
      noUserInteraction = writeText(normalizedValue)
      setState({
        value: normalizedValue,
        error: undefined,
        noUserInteraction,
      })
    }
    catch (error) {
      setState({
        value: normalizedValue,
        error,
        noUserInteraction,
      } as CopyToClipboardState)
    }
  }, [])

  return [state, copyToClipboard]
}
