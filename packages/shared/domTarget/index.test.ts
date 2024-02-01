import { describe, test, expect } from 'vitest';
import { getTargetElement } from './index';

describe('getTargetElement', () => {
  test('should return the target element when it is a function', () => {
    const target = () => document.createElement('div');
    const result = getTargetElement(target);
    expect(result).toBeInstanceOf(HTMLElement);
  });

  test('should return the target element when it is a DOM element', () => {
    const target = document.createElement('div');
    const result = getTargetElement(target);
    expect(result).toBeInstanceOf(HTMLElement);
  });

  test('should return the target element when it is a document object', () => {
    const target = document;
    const result = getTargetElement(target);
    expect(result).toBeInstanceOf(Document);
  });

  test('should return the default element when the target is undefined', () => {
    const target = undefined;
    const defaultElement = document.createElement('div');
    const result = getTargetElement(target, defaultElement);
    expect(result).toBe(defaultElement);
  });

  test('should return the default element when the target is null', () => {
    const target = null;
    const defaultElement = document.createElement('div');
    const result = getTargetElement(target, defaultElement);
    expect(result).toBe(defaultElement);
  });
});
