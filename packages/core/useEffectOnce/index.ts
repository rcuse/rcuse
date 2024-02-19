import React, { useEffect } from 'react'

export const useEffectOnce = (effect: React.EffectCallback) => {
  useEffect(effect, []);
}
