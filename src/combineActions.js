import isString from 'lodash/isString';
import isFunction from 'lodash/isFunction';
import isEmpty from 'lodash/isEmpty';
import toString from 'lodash/toString';
import isSymbol from 'lodash/isSymbol';
import invariant from 'invariant';

export const ACTION_TYPE_DELIMITER = '||';

function isValidActionType(actionType) {
  return isString(actionType) || isFunction(actionType) || isSymbol(actionType);
}

function isValidActionTypes(actionTypes) {
  if (isEmpty(actionTypes)) {
    return false;
  }
  return actionTypes.every(isValidActionType);
}

export default function combineActions(...actionsTypes) {
  invariant(
    isValidActionTypes(actionsTypes),
    'Expected action types to be strings, symbols, or action creators'
  );
  const combinedActionType = actionsTypes.map(toString).join(ACTION_TYPE_DELIMITER);
  return { toString: () => combinedActionType };
}
