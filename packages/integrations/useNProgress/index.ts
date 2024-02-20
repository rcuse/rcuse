import { useState, useEffect } from 'react'
import nprogress from 'nprogress'
import { isClient } from '@rcuse/shared';

import type { NProgressOptions } from 'nprogress'

export type UseNProgressOptions = Partial<NProgressOptions>

export function useNProgress(
  currentProgress: number | null | undefined = null,
  options?: UseNProgressOptions,
) {
  const [progress, setProgressState] = useState(currentProgress)
  const [isLoading, setIsLoading] = useState(false);

  if (options)
    nprogress.configure(options)

  useEffect(
    () => {
      if (typeof progress === 'number' && progress < 1) {
        handleStart();
      } else {
        handleDone();
      }

      return () => {
        if (isLoading) {
          nprogress.done();
        }
      };
    },
    [isLoading]
  )

  const setProgress = nprogress.set
  nprogress.set = (n: number) => {
    setProgressState(n)
    return setProgress.call(nprogress, n)
  }

  useEffect(
    () => {
      if (typeof progress === 'number' && isClient)
        setProgress.call(nprogress, progress)
    },
    [progress]
  )

  const handleStart = () => {
    setIsLoading(true);
    nprogress.start();
  }

  const handleDone = () => {
    setIsLoading(false);
    nprogress.done();
  }

  return {
    isLoading,
    progress,
    start: handleStart,
    done: handleDone,
    remove: () => {
      setProgressState(null)
      nprogress.remove()
    },
  }
}
