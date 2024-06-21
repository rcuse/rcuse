import React from 'react'

export const useReactId = (React as any)['useId'.toString()] || (() => undefined)
