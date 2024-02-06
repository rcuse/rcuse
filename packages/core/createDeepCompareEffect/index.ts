import { useRef } from 'react';
import { isEqual } from '@rcuse/shared';

import type { DependencyList, useEffect, useLayoutEffect } from 'react';

type EffectHookType = typeof useEffect | typeof useLayoutEffect;
type CreateUpdateEffect = (hook: EffectHookType) => EffectHookType;

export const createDeepCompareEffect: CreateUpdateEffect = (hook) => (effect, deps) => {
  const ref = useRef<DependencyList>();
  const signalRef = useRef<number>(0);

  if (deps === undefined || !isEqual(deps, ref.current)) {
    ref.current = deps;
    signalRef.current += 1;
  }

  hook(effect, [signalRef.current]);
};
