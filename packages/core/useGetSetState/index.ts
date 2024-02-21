import { useCallback, useRef } from 'react';
import { useUpdate } from '../useUpdate';

export const useGetSetState = <T extends object>(
  initialState: T = {} as T
): [() => T, (patch: Partial<T>) => void] => {
  const update = useUpdate();
  const state = useRef<T>({ ...(initialState as object) } as T);

  const get = useCallback(() => state.current, []);
  const set = useCallback((patch: Partial<T>) => {
    if (!patch) {
      return;
    }
    Object.assign(state.current, patch);
    update();
  }, []);

  return [get, set];
};
