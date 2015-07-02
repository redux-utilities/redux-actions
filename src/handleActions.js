import handleAction from './handleAction';
import reduceReducers from 'reduce-reducers';

export default function handleActions(handlers) {
  const reducers = Object.keys(handlers).reduce((result, type) => {
    result.push(handleAction(type, handlers[type]));
    return result;
  }, []);

  return reduceReducers(...reducers);
}
