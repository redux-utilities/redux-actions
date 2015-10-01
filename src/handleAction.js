/* @flow */

import { isError } from 'flux-standard-action';

import type {Action} from './createAction';
import identity from './identity';

export type State = Object;
export type Reducer = (state: State, action: Action) => State;
export type ReducerMap = {
  next?: Reducer;
  throw?: Reducer;
};

export default function handleAction(
  type: string,
  reducers: Reducer | ReducerMap
): Reducer {
  return (state, action) => {
    // If action type does not match, return previous state
    if (action.type !== type) {
      return state;
    }

    let next;
    let error;

    // If function is passed instead of map, use as reducer
    if (typeof reducers === 'function') {
      next = reducers;
      error = identity;
    } else {
      next = reducers.next || identity;
      error = reducers.throw || identity;
    }

    const finalReducer = isError(action) ? error : next;
    if (typeof finalReducer === 'function') {
      return finalReducer(state, action);
    }

    return identity(state);
  };
}
