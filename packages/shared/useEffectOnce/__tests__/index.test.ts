import { renderHook } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { useEffectOnce } from '../index'

const mockEffectCleanup = vi.fn();
const mockEffectCallback = vi.fn().mockReturnValue(mockEffectCleanup);

describe('useEffectOnce', () => {
  it('should be defined', () => {
    expect(useEffectOnce).toBeDefined();
  });

  it('should run provided effect only once', () => {
    const { rerender } = renderHook(() => useEffectOnce(mockEffectCallback));
    expect(mockEffectCallback).toHaveBeenCalledTimes(1);

    rerender();
    expect(mockEffectCallback).toHaveBeenCalledTimes(1);
  });

  it('should run clean-up provided on unmount', () => {
    const { unmount } = renderHook(() => useEffectOnce(mockEffectCallback));
    expect(mockEffectCleanup).not.toHaveBeenCalled();

    unmount();
    expect(mockEffectCleanup).toHaveBeenCalledTimes(1);
  });
})
