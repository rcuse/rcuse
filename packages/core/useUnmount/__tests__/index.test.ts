import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useUnmount } from '../index';

describe('useUnmount', () => {
  it('should be defined', () => {
    expect(useUnmount).toBeDefined();
  });

  it('useUnmount should work', async () => {
    const fn = vi.fn();
    const hook = renderHook(() => useUnmount(fn));

    expect(fn).toBeCalledTimes(0);

    hook.rerender();
    expect(fn).toBeCalledTimes(0);

    hook.unmount();
    expect(fn).toBeCalledTimes(1);
  })
});
