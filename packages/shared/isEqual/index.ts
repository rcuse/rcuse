/**
 * 检查两个值是否相等
 * @param value1
 * @param value2
 * @returns
 */
export function isEqual(value1: any, value2: any, shallow = false): boolean {
  const refSet = new Set<any>();

  function deepEqual(a: any, b: any, level = 1): boolean {
    const circular = refSet.has(a);

    if (circular) {
      return false;
    }

    if (a === b) {
      return true;
    }
    if (shallow && level > 1) {
      return false;
    }

    refSet.add(a);
    const newLevel = level + 1;

    if (Array.isArray(a)) {
      if (!Array.isArray(b) || a.length !== b.length) {
        return false;
      }
      for (let i = 0; i < a.length; i++) {
        if (!deepEqual(a[i], b[i], newLevel)) {
          return false;
        }
      }
      return true;
    }

    if (a && b && typeof a === 'object' && typeof b === 'object') {
      const keys = Object.keys(a);
      if (keys.length !== Object.keys(b).length) {
        return false;
      }
      return keys.every((key) => deepEqual(a[key], b[key], newLevel));
    }

    return false;
  }

  return deepEqual(value1, value2);
}
