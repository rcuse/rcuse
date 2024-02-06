import { renderHook, act } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useBoolean } from '../index';

const setUp = (defaultValue?: boolean) => renderHook(() => useBoolean(defaultValue));

describe('useBoolean', () => {
  it('test on methods', async () => {
    const { result } = setUp();
    expect(result.current[0]).toBe(false);
    act(() => {
      result.current[1].setTrue();
    });
    expect(result.current[0]).toBe(true);
    act(() => {
      result.current[1].setFalse();
    });
    expect(result.current[0]).toBe(false);
    act(() => {
      result.current[1].toggle();
    });
    expect(result.current[0]).toBe(true);
    act(() => {
      result.current[1].toggle();
    });
    expect(result.current[0]).toBe(false);
    act(() => {
      result.current[1].set(false);
    });
    expect(result.current[0]).toBe(false);
    act(() => {
      result.current[1].set(true);
    });
    expect(result.current[0]).toBe(true);
  });

  it('test on default value', () => {
    const hook1 = setUp(true);
    expect(hook1.result.current[0]).toBe(true);
    const hook2 = setUp();
    expect(hook2.result.current[0]).toBe(false);
  });
});
