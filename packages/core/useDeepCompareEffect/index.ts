import { useEffect } from 'react';
import { createDeepCompareEffect } from '../createDeepCompareEffect';

export const useDeepCompareEffect = createDeepCompareEffect(useEffect);
