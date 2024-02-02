import { describe, expect, it } from 'vitest';
import { renderHook } from '@testing-library/react-hooks';
import { useNetwork } from '../index';

describe('useLatest', () => {
  it('should be defined', () => {
    expect(useNetwork).toBeDefined();
  });

  it('should return an object of certain structure', () => {
    const hook = renderHook(() => useNetwork(), { initialProps: false });

    expect(typeof hook.result.current).toEqual('object');
    expect(Object.keys(hook.result.current)).toEqual([
      'online',
      'previous',
      'since',
      'downlink',
      'downlinkMax',
      'effectiveType',
      'rtt',
      'saveData',
      'type',
    ]);
  });
})
