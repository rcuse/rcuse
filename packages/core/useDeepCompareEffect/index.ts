import { useEffect } from 'react';
import { createDeepCompareEffect } from '../helpers/createDeepCompareEffect';

export const useDeepCompareEffect = createDeepCompareEffect(useEffect);
