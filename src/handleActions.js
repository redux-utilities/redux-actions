import handleAction from './handleAction';
import ownKeys from './ownKeys';
import assertDefaultState from './assertDefaultState';
import reduceReducers from 'reduce-reducers';

export default function handleActions(handlers, defaultState) {
  const actionTypes = ownKeys(handlers);
  assertDefaultState(defaultState, actionTypes);

  const reducers = actionTypes.map(type => handleAction(type, handlers[type]));
  const reducer = reduceReducers(...reducers);

  return (state = defaultState, action) => reducer(state, action);
}
