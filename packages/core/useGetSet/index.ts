import { Dispatch, useMemo, useRef } from 'react';
import { useUpdate } from '../useUpdate';
import { resolveHookState } from '../helpers/hookState';

import type { HookStateInitAction, HookStateSetAction } from '../helpers/hookState';

export function useGetSet<S>(
  initialState: HookStateInitAction<S>
): [get: () => S, set: Dispatch<HookStateSetAction<S>>] {
  const state = useRef(resolveHookState(initialState));
  const update = useUpdate();

  return useMemo(
    () => [
      () => state.current as S,
      (newState: HookStateSetAction<S>) => {
        state.current = resolveHookState(newState, state.current);
        update();
      },
    ],
    []
  );
}
