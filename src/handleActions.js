import handleAction from './handleAction';
import reduceReducers from 'reduce-reducers';

export default function handleActions(handlers, defaultState) {
  const reducers = Object.keys(handlers).map(type => {
    return handleAction(type, handlers[type]);
  });

  return typeof defaultState !== 'undefined'
    ? (state = defaultState, action) => reduceReducers(...reducers)(state, action)
    : reduceReducers(...reducers);
}
