import isPlainObject from 'lodash/isPlainObject';
import reduceReducers from 'reduce-reducers';
import invariant from 'invariant';
import handleAction from './handleAction';
import ownKeys from './ownKeys';
import { flattenReducerMap } from './flattenUtils';

export default function handleActions(handlers, defaultState, options = {}) {
  invariant(
    isPlainObject(handlers),
    'Expected handlers to be a plain object.'
  );
  const flattenedReducerMap = flattenReducerMap(handlers, options);
  const reducers = ownKeys(flattenedReducerMap).map(type =>
    handleAction(
      type,
      flattenedReducerMap[type],
      defaultState
    )
  );
  const reducer = reduceReducers(...reducers);
  return (state = defaultState, action) => reducer(state, action);
}
