import { useNetwork } from '@rcuse/core';

export const App = () => {
  const { online } = useNetwork()

  return (
    <>
      是否联网：{online + ''}
    </>
  )
}
