import { useEffect, useState } from 'react';
import { off, on } from '@rcuse/shared';
import { conn, getConnectionState } from './utils';

import type { HookStateInitAction, NetworkState } from './types';

export function useNetwork(
  initialState?: HookStateInitAction<NetworkState>
): NetworkState {
  const [state, setState] = useState(initialState ?? getConnectionState);

  useEffect(
    () => {
      const handleStateChange = () => {
        setState(getConnectionState);
      };

      on(window, 'online', handleStateChange, { passive: true });
      on(window, 'offline', handleStateChange, { passive: true });

      if (conn) {
        on(conn, 'change', handleStateChange, { passive: true });
      }

      return () => {
        off(window, 'online', handleStateChange);
        off(window, 'offline', handleStateChange);

        if (conn) {
          off(conn, 'change', handleStateChange);
        }
      };
    },
    []
  )

  return state;
}
