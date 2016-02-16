import handleAction from './handleAction';
import ownKeys from './ownKeys';
import reduceReducers from 'reduce-reducers';

export default function handleActions(handlers, defaultState) {
  const reducers = ownKeys(handlers).map(type => {
    return handleAction(type, handlers[type]);
  });
  const reducer = reduceReducers(...reducers);

  return typeof defaultState !== 'undefined'
    ? (state = defaultState, action) => reducer(state, action)
    : reducer;
}
