import handleAction from './handleAction';
import ownKeys from './ownKeys';
import reduceReducers from 'reduce-reducers';

export default function handleActions(handlers, defaultState) {
  const reducers = ownKeys(handlers).map(type =>
    handleAction(type, handlers[type])
  );

  const reduction = reduceReducers(...reducers);

  return (state = defaultState, action) => reduction(state, action);
}
