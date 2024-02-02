export type HookStateInitialSetter<S> = () => S;
export type HookStateInitAction<S> = S | HookStateInitialSetter<S>;

export interface NetworkInformation extends EventTarget {
  readonly downlink: number;
  readonly downlinkMax: number;
  readonly effectiveType: 'slow-2g' | '2g' | '3g' | '4g';

  readonly rtt: number;
  readonly saveData: boolean;
  readonly type:
    | 'bluetooth'
    | 'cellular'
    | 'ethernet'
    | 'none'
    | 'wifi'
    | 'wimax'
    | 'other'
    | 'unknown';

  onChange: (event: Event) => void;
}

export interface NetworkState {
  /**
   * 浏览器是否连接到网络
   */
  online: boolean | undefined;
  /**
   * online 属性的前一个值
   * 有助于识别浏览器是刚刚连接上还是失去了连接
   */
  previous: boolean | undefined;
  since: Date | undefined;
  /**
   * 有效带宽估计值，以每秒兆比特（Mbps）为单位，四舍五入到最接近的 25 千比特每秒的倍数。
   */
  downlink: NetworkInformation['downlink'] | undefined;
  /**
   * 底层连接技术的最大下行速率，以每秒兆比特（Mbps）为单位
   */
  downlinkMax: NetworkInformation['downlinkMax'] | undefined;
  effectiveType: NetworkInformation['effectiveType'] | undefined;
  rtt: NetworkInformation['rtt'] | undefined;
  saveData: NetworkInformation['saveData'] | undefined;
  type: NetworkInformation['type'] | undefined;
}

