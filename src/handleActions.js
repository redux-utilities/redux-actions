/* @flow */

import handleAction from './handleAction';
import ownKeys from './ownKeys';
import reduceReducers from 'reduce-reducers';

import type {ActionType} from './createAction';
import type {State, Reducer, ReducerMap} from './handleAction';

type Handlers = {
  [type: ActionType]: Reducer | ReducerMap;
};

export default function handleActions(
  handlers: Handlers,
  defaultState: ?State
): State {
  const reducers = ownKeys(handlers).map(type => {
    return handleAction(type, handlers[type]);
  });

  return defaultState !== undefined
    ? (state = defaultState, action) => reduceReducers(...reducers)(state, action)
    : reduceReducers(...reducers);
}
