import isFunction from 'lodash/isFunction';
import identity from 'lodash/identity';
import isNil from 'lodash/isNil';
import isString from 'lodash/isString';
import isSymbol from 'lodash/isSymbol';
import includes from 'lodash/includes';
import { ACTION_TYPE_DELIMITER } from './combineActions';

export default function handleAction(actionType, reducers, defaultState) {
  const actionTypes = actionType.toString().split(ACTION_TYPE_DELIMITER);

  const [nextReducer, throwReducer] = isFunction(reducers)
    ? [reducers, reducers]
    : [reducers.next, reducers.throw].map(reducer => (isNil(reducer) ? identity : reducer));

  return (state = defaultState, action) => {
    if (!isValidFSA(action)) {
      throw new Error('The FSA spec mandates an action object with a type. Try using the createAction(s) method.');
    }

    if (!includes(actionTypes, action.type.toString())) {
      return state;
    }

    return (action.error === true ? throwReducer : nextReducer)(state, action);
  };
}

function isValidFSA(action) {
  return !!action && (isString(action.type) || isSymbol(action.type));
}
