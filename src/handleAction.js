import isFunction from 'lodash/isFunction';
import identity from 'lodash/identity';
import isNil from 'lodash/isNil';
import includes from 'lodash/includes';
import { ACTION_DELIMITER } from './combineActions';

export default function handleAction(type, reducers, defaultState) {
  const typeValue = type.toString().split(ACTION_DELIMITER);

  const [nextReducer, throwReducer] = isFunction(reducers)
    ? [reducers, reducers]
    : [reducers.next, reducers.throw].map(reducer => (isNil(reducer) ? identity : reducer));

  return (state = defaultState, action) => {
    if (!includes(typeValue, action.type.toString())) {
      return state;
    }
    return (action.error === true ? throwReducer : nextReducer)(state, action);
  };
}
