import isPlainObject from 'lodash/isPlainObject';
import isMap from 'lodash/isMap';
import reduceReducers from 'reduce-reducers';
import invariant from 'invariant';
import handleAction from './handleAction';
import ownKeys from './ownKeys';
import { flattenReducerMap } from './flattenUtils';

function get(key, x) {
  return isMap(x) ? x.get(key) : x[key];
}

export default function handleActions(handlers, defaultState, { namespace } = {}) {
  invariant(
    isPlainObject(handlers) || isMap(handlers),
    'Expected handlers to be a plain object.'
  );
  const flattenedReducerMap = flattenReducerMap(handlers, namespace);
  const reducers = ownKeys(flattenedReducerMap).map(type =>
    handleAction(
      type,
      get(type, flattenedReducerMap),
      defaultState
    )
  );
  const reducer = reduceReducers(...reducers);
  return (state = defaultState, action) => reducer(state, action);
}
