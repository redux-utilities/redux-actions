import isFunction from 'lodash/isFunction';
import identity from 'lodash/identity';
import isNil from 'lodash/isNil';
import isUndefined from 'lodash/isUndefined';
import includes from 'lodash/includes';
import { ACTION_TYPE_DELIMITER } from './combineActions';

export default function handleAction(actionType, reducers, defaultState) {
  const actionTypes = actionType.toString().split(ACTION_TYPE_DELIMITER);

  if (isUndefined(defaultState)) {
    throw new Error(`Expected defaultState for reducer handling ${actionTypes} to be defined`)
  }
  
  const [nextReducer, throwReducer] = isFunction(reducers)
    ? [reducers, reducers]
    : [reducers.next, reducers.throw].map(reducer => (isNil(reducer) ? identity : reducer));

  return (state = defaultState, action) => {
    if (!includes(actionTypes, action.type.toString())) {
      return state;
    }

    return (action.error === true ? throwReducer : nextReducer)(state, action);
  };
}
