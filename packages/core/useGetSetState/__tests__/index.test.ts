import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useGetSetState } from '../index'

const setUp = <T extends object>(initialValue: T) => renderHook(() => useGetSetState(initialValue));

const mockConsoleError = vi.fn();
const originalConsoleError = console.error;

describe('useGetSetState', () => {
  beforeEach(() => {
    console.error = mockConsoleError;
    vi.clearAllMocks()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.clearAllTimers()
    console.error = originalConsoleError;
  })

  it('should be defined', () => {
    expect(useGetSetState).toBeDefined();
  });

  it('should init getter and setter', () => {
    const { result } = setUp({ foo: 'initialValue' });
    const [get, set] = result.current;

    expect(get).toBeInstanceOf(Function);
    expect(set).toBeInstanceOf(Function);
  });

  it('should get current state', () => {
    const { result } = setUp({ foo: 'a', bar: 'z' });
    const [get] = result.current;

    const currentState = get();

    expect(currentState).toEqual({ foo: 'a', bar: 'z' });
  });

  it('should set new state by applying patch with existing keys', () => {
    const { result } = setUp({ foo: 'a', bar: 'z' });
    const [get, set] = result.current;

    act(() => set({ bar: 'y' }));

    const currentState = get();
    expect(currentState).toEqual({ foo: 'a', bar: 'y' });
  });

  it('should set new state by applying patch with new keys', () => {
    const { result } = setUp<{ foo: string; bar: string; qux?: string }>({ foo: 'a', bar: 'z' });
    const [get, set] = result.current;

    act(() => set({ qux: 'f' }));

    const currentState = get();
    expect(currentState).toEqual({ foo: 'a', bar: 'z', qux: 'f' });
  });

  it('should set new state by applying patch with both new and old keys', () => {
    const { result } = setUp<{ foo: string; bar: string; qux?: string }>({ foo: 'a', bar: 'z' });
    const [get, set] = result.current;

    act(() => set({ bar: 'y', qux: 'f' }));

    const currentState = get();
    expect(currentState).toEqual({ foo: 'a', bar: 'y', qux: 'f' });
  });

  it('should NOT set new state if empty patch received', () => {
    const { result } = setUp({ foo: 'a', bar: 'z' });
    const [get, set] = result.current;

    act(() => set({}));

    const currentState = get();
    expect(currentState).toEqual({ foo: 'a', bar: 'z' });
  });

  it('should NOT set new state if no patch received', () => {
    const { result } = setUp({ foo: 'a', bar: 'z' });
    const [get, set] = result.current;

    // @ts-ignore
    act(() => set());

    const currentState = get();
    expect(currentState).toEqual({ foo: 'a', bar: 'z' });
  });

  it('should get and set expected state when used in nested functions', () => {
    const onClick = vi.fn(() => {
      setTimeout(() => {
        set({ counter: get().counter + 1 });
      }, 1000);
    });

    const { result } = setUp({ counter: 0 });
    const [get, set] = result.current;

    // simulate 3 clicks
    onClick();
    onClick();
    onClick();

    // fast-forward until all timers have been executed
    act(() => {
      vi.runAllTimers();
    });

    const currentState = get();
    expect(currentState).toEqual({ counter: 3 });
    expect(onClick).toHaveBeenCalledTimes(3);
  });
})
