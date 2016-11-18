import handleAction from './handleAction';
import ownKeys from './ownKeys';

export default function handleActions(handlers, defaultState) {
  const reducers = ownKeys(handlers).map(type =>
    handleAction(
      type,
      handlers[type],
      defaultState
    )
  );
  const reducer = (state, action, ...args) => reducers.reduce(
    (previousState, currentReducer) =>
      currentReducer(previousState, action, ...args),
    state
  );
  return (state, action, ...args) => reducer(state, action, ...args);
}

