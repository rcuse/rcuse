import { describe, expect, it } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { nextTwoTick } from '../../../.test/nextTick';
import { useNetwork } from '../index';

describe('useNetwork', () => {
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

  it('toggle network state', async () => {
    const { result } = renderHook(() => useNetwork());

    expect(result.current.online).toBeTruthy();

    act(() => {
      window.dispatchEvent(new Event('offline'));
    });
    await nextTwoTick()
    expect(result.current.online).toBeTruthy();
  });
})
