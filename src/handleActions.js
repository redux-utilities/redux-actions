import reduceReducers from 'reduce-reducers';
import isPlainObject from 'is-plain-object';
import invariant from 'invariant';
import isMap from './utils/isMap';
import ownKeys from './utils/ownKeys';
import flattenReducerMap from './utils/flattenReducerMap';
import handleAction from './handleAction';

function get(key, x) {
  return isMap(x) ? x.get(key) : x[key];
}

export default function handleActions(handlers, defaultState, options = {}) {
  invariant(
    isPlainObject(handlers) || isMap(handlers),
    'Expected handlers to be a plain object.'
  );
  const flattenedReducerMap = flattenReducerMap(handlers, options);
  const reducers = ownKeys(flattenedReducerMap).map(type =>
    handleAction(type, get(type, flattenedReducerMap), defaultState)
  );
  const reducer = reduceReducers(...reducers);
  return (state = defaultState, action) => reducer(state, action);
}
