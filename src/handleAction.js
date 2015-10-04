/* @flow */

import { isError } from 'flux-standard-action';

import type {Action} from './createAction';
import identity from './identity';

export type State = Object;
export type Reducer = (state: State, action: Action) => State;
export type ReducerMap = {
  complete?: Reducer;
  error?: Reducer;
  first?: Reducer;
  next?: Reducer;
};

export default function handleAction(
  type: string,
  reducers: Reducer | ReducerMap
): Reducer {
  return (state: State, action: Action) => {
    // If action type does not match, return previous state
    if (action.type !== type) {
      return state;
    }

    let complete = identity;
    let error = identity;
    let first = identity;
    let next = identity;

    // If function is passed instead of map, use as reducer
    if (typeof reducers === 'function') {
      next = reducers;
    } else {
      complete = reducers.complete || identity;
      error = reducers.error || identity;
      first = reducers.first || identity;
      next = reducers.next || identity;
    }

    let finalReducer = next;
    if (isError(action)) {
      finalReducer = error;
    } else if (isComplete(action)) {
      finalReducer = complete;
    } else if (isFirst(action)) {
      finalReducer = first;
    }

    if (typeof finalReducer === 'function') {
      return finalReducer(state, action);
    }

    return identity(state);
  };
}

function isFirst(action: Action): bool {
  return !!(action.meta && action.meta.sequence === 'first');
}

function isComplete(action: Action): bool {
  return !!(action.meta && action.meta.sequence === 'complete');
}
