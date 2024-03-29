import React from 'react';

/**
 * 判断依赖是否为同一个值
 * @param oldDeps
 * @param deps
 * @returns
 */
export function depsAreSame(oldDeps: React.DependencyList, deps: React.DependencyList) {
  if (oldDeps === deps) return true;

  for (let i = 0; i < oldDeps.length; i++) {
    if (!Object.is(oldDeps[i], deps[i])) return false;
  }

  return true;
}
