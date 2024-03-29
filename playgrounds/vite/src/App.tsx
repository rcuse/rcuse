import { useRef } from 'react'
import { useNetwork } from '@rcuse/core'
import { useCopyToClipboard, useFullscreen, useNProgress } from '@rcuse/integrations'

export function App() {
  const ref = useRef<HTMLDivElement>(null)
  const { online } = useNetwork()
  const { isLoading, progress, start, done } = useNProgress()
  const [isFullscreen, { enterFullscreen, exitFullscreen, toggleFullscreen }] = useFullscreen(ref)

  const [, copy] = useCopyToClipboard()

  const handleCopy = () => {
    copy('hello world!')
  }

  return (
    <>
      是否联网：
      {`${online}`}
      <br />
      <button onClick={() => { !isLoading ? start() : done() }}>
        { !isLoading ? 'Start' : 'Stop' }
      </button>
      {isLoading && (
        <b>
          { ((progress || 0) * 100).toFixed(0) }
          %
        </b>
      )}
      <div ref={ref} style={{ background: 'white' }}>
        <div style={{ marginBottom: 16 }}>{isFullscreen ? 'Fullscreen' : 'Not fullscreen'}</div>
        <div>
          <button type="button" onClick={enterFullscreen}>
            enterFullscreen
          </button>
          <button type="button" onClick={exitFullscreen} style={{ margin: '0 8px' }}>
            exitFullscreen
          </button>
          <button type="button" onClick={toggleFullscreen}>
            toggleFullscreen
          </button>
        </div>
      </div>
      <br />
      <button onClick={handleCopy}>拷贝文案</button>
    </>
  )
}
