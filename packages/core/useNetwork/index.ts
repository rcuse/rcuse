import { useEffect, useState } from 'react';
import { off, on } from '@rcuse/shared';
import { conn, getConnectionState } from './utils';

import type { HookStateInitAction, NetworkState } from './types';

enum NetworkEventType {
  ONLINE = 'online',
  OFFLINE = 'offline',
  CHANGE = 'change',
}

export function useNetwork(
  initialState?: HookStateInitAction<NetworkState>
): NetworkState {
  const [state, setState] = useState(initialState ?? getConnectionState);

  useEffect(
    () => {
      const handleStateChange = () => {
        setState(getConnectionState);
      };

      on(window, NetworkEventType.ONLINE, handleStateChange, { passive: true });
      on(window, NetworkEventType.OFFLINE, handleStateChange, { passive: true });

      if (conn) {
        on(conn, NetworkEventType.CHANGE, handleStateChange, { passive: true });
      }

      return () => {
        off(window, NetworkEventType.ONLINE, handleStateChange);
        off(window, NetworkEventType.OFFLINE, handleStateChange);

        if (conn) {
          off(conn, NetworkEventType.CHANGE, handleStateChange);
        }
      };
    },
    []
  )

  return state;
}
