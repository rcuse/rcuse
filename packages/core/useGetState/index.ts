import React, { useState, useRef, useCallback } from 'react';

type GetStateAction<S> = () => S;

function useGetState<S>(
  initialState: S | (() => S),
): [S, React.Dispatch<React.SetStateAction<S>>, GetStateAction<S>];
function useGetState<S = undefined>(): [
  S | undefined,
  React.Dispatch<React.SetStateAction<S | undefined>>,
  GetStateAction<S | undefined>,
];
function useGetState<S>(initialState?: S) {
  const [state, setState] = useState(initialState);
  const stateRef = useRef(state);
  stateRef.current = state;

  const getState = useCallback(() => stateRef.current, []);

  return [state, setState, getState];
}

export {
  useGetState,
}
