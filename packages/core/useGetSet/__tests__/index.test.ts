import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { useGetSet } from '../index';

const setUp = <T>(initialValue: T) =>
  renderHook(() => {
    const [get, set] = useGetSet<T>(initialValue);

    return {
      get,
      set,
    } as const;
  });

describe('useGetSet', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.clearAllTimers()
  })

  it('should be defined', () => {
    expect(useGetSet).toBeDefined();
  });

  it('should init getter and setter', () => {
    const { result } = setUp('foo');
    const { get, set } = result.current;

    expect(get).toBeInstanceOf(Function);
    expect(set).toBeInstanceOf(Function);
  });

  it('should get current value', () => {
    const { result } = setUp('foo');
    const { get } = result.current;

    const currentValue = get();

    expect(currentValue).toBe('foo');
  });

  it('should set new value', () => {
    const { result } = setUp('foo');
    const { get, set } = result.current;

    act(() => set('bar'));

    const currentValue = get();
    expect(currentValue).toBe('bar');
  });

  it('should get and set expected values when used in nested functions', () => {
    const onClick = vi.fn(() => {
      setTimeout(() => {
        set(get() + 1);
      }, 1000);
    });

    const { result } = setUp(0);
    const { get, set } = result.current;

    // simulate 3 clicks
    onClick();
    onClick();
    onClick();

    // fast-forward until all timers have been executed
    act(() => {
      vi.runAllTimers();
    });

    const currentValue = get();
    expect(currentValue).toBe(3);
    expect(onClick).toHaveBeenCalledTimes(3);
  });
})
