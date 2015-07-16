import handleAction from './handleAction';
import handleAsyncAction from './handleAsyncAction';
import reduceReducers from 'reduce-reducers';

export default function handleActions(handlers, defaultState) {
  const reducers = Object.keys(handlers).reduce((result, type) => {
    const reducer = handlers[type];
    const handler = reducer.begin || reducer.end ?
      handleAsyncAction(type, reducer) :
      handleAction(type, reducer);

    result.push(handler);
    return result;
  }, []);

  return typeof defaultState !== 'undefined'
    ? (state = defaultState, action) => reduceReducers(...reducers)(state, action)
    : reduceReducers(...reducers);
}
