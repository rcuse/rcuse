import { isClient } from '@rcuse/core'
import { createUseStorageState } from '../helpers/createUseStorageState'

export const useLocalStorageState = createUseStorageState(() => (isClient ? localStorage : undefined))
