import isPlainObject from 'lodash/isPlainObject';
import reduceReducers from 'reduce-reducers';
import invariant from 'invariant';
import handleAction from './handleAction';
import ownKeys from './ownKeys';

export default function handleActions(handlers, defaultState) {
  invariant(
    isPlainObject(handlers),
    'Expected handlers to be an object with reducers'
  );
  const reducers = ownKeys(handlers).map(type =>
    handleAction(
      type,
      handlers[type],
      defaultState
    )
  );
  const reducer = reduceReducers(...reducers);
  return (state = defaultState, action) => reducer(state, action);
}
