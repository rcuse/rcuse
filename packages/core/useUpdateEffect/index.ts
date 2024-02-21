import { useEffect } from 'react';
import { createUpdateEffect } from '../helpers/createUpdateEffect';

export const useUpdateEffect = createUpdateEffect(useEffect);
