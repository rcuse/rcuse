import { useNetwork } from '@rcuse/core';
import { useNProgress } from '@rcuse/integrations';

export const App = () => {
  const { online } = useNetwork()
  const { isLoading, progress, start, done } = useNProgress();

  return (
    <>
      是否联网：{online + ''}
      <br />
      <button onClick={() => { !isLoading ? start() : done() }}>
        { !isLoading ? 'Start' : 'Stop' }
      </button>
      {isLoading && (<b>{ ((progress || 0) * 100).toFixed(0) }%</b>)}
    </>
  )
}
