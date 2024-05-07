import { isClient } from '@rcuse/shared'
import { createUseStorageState } from '../helpers/createUseStorageState'

export const useSessionStorageState = createUseStorageState(() =>
  isClient ? sessionStorage : undefined,
)
