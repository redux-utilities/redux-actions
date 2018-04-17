import isString from 'lodash/isString';
import isFunction from 'lodash/isFunction';
import isEmpty from 'lodash/isEmpty';
import toString from 'lodash/toString';
import isSymbol from 'lodash/isSymbol';
import invariant from 'invariant';
import { ACTION_TYPE_DELIMITER } from './constants';

function isValidActionType(type) {
  return isString(type) || isFunction(type) || isSymbol(type);
}

function isValidActionTypes(types) {
  if (isEmpty(types)) {
    return false;
  }
  return types.every(isValidActionType);
}

export default function combineActions(...actionsTypes) {
  invariant(
    isValidActionTypes(actionsTypes),
    'Expected action types to be strings, symbols, or action creators'
  );
  const combinedActionType = actionsTypes.map(toString).join(ACTION_TYPE_DELIMITER);
  return { toString: () => combinedActionType };
}
