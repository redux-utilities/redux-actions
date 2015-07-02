import handleAction from './handleAction';
import reduceReducers from 'reduce-reducers';

export default function handleActions(handlers, defaultState) {
  const reducers = Object.keys(handlers).reduce((result, type) => {
    result.push(handleAction(type, handlers[type]));
    return result;
  }, []);

  return typeof defaultState !== 'undefined'
    ? (state = defaultState, action) => reduceReducers(...reducers)(state, action)
    : reduceReducers(...reducers);
}
