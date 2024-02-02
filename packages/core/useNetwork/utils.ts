import { isNavigator } from '@rcuse/shared';

import type { NetworkInformation, NetworkState } from './types';

export const nav:
  | (Navigator &
      Partial<Record<'connection' | 'mozConnection' | 'webkitConnection', NetworkInformation>>)
  | undefined = isNavigator ? navigator : undefined;

export const conn: NetworkInformation | undefined =
  nav && (nav.connection || nav.mozConnection || nav.webkitConnection);

export function getConnectionState(previousState?: NetworkState): NetworkState {
  const online = nav?.onLine;
  const previousOnline = previousState?.online;

  return {
    online,
    previous: previousOnline,
    since: online !== previousOnline ? new Date() : previousState?.since,
    downlink: conn?.downlink,
    downlinkMax: conn?.downlinkMax,
    effectiveType: conn?.effectiveType,
    rtt: conn?.rtt,
    saveData: conn?.saveData,
    type: conn?.type,
  };
}
