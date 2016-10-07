import isFunction from 'lodash/isFunction';
import identity from 'lodash/identity';
import isNil from 'lodash/isNil';
import includes from 'lodash/includes';
import { ACTION_TYPE_DELIMITER } from './combineActions';

export default function handleAction(actionType, reducers, defaultState) {
  const actionTypes = actionType.toString().split(ACTION_TYPE_DELIMITER);

  const [nextReducer, throwReducer] = isFunction(reducers)
    ? [reducers, reducers]
    : [reducers.next, reducers.throw].map(reducer => (isNil(reducer) ? identity : reducer));

  return (state = defaultState, action, ...args) => {
    if (!includes(actionTypes, action.type.toString())) {
      return state;
    }

    return (
      action.error === true ? throwReducer : nextReducer
    )(state, action, ...args);
  };
}
