import { describe, expect, it } from 'vitest';
import { uuid } from '../index';

describe(uuid.name, () => {
  it('返回值为字符串', () => {
    expect(uuid()).toBeTypeOf('string');
  });

  it('多次调用返回值不同', () => {
    const id1 = uuid();
    const id2 = uuid();

    expect(id1 === id2).toBeFalsy();
  });
});
