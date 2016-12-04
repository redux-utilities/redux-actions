import handleAction from './handleAction';
import ownKeys from './utils/ownKeys';
import reduceReducers from 'reduce-reducers';

export default function handleActions(handlers, defaultState) {
  const reducers = ownKeys(handlers).map(type =>
    handleAction(
      type,
      handlers[type],
      defaultState
    )
  );
  const reducer = reduceReducers(...reducers);
  return (state, action) => reducer(state, action);
}
