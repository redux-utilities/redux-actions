import isString from 'lodash/isString';
import isFunction from 'lodash/isFunction';
import isEmpty from 'lodash/isEmpty';
import toString from 'lodash/toString';
import isSymbol from 'lodash/isSymbol';

export const ACTION_TYPE_DELIMITER = '|redux-action-delimiter|';

export default function combineActions(...actions) {
  if (isEmpty(actions) || !actions.every(isValidActionType)) {
    throw new TypeError('Expected actions to be strings, symbols, or action creators');
  }

  const combinedActionsString = actions.map(toString).join(ACTION_TYPE_DELIMITER);

  return Object.create(null, {
    toString: { enumerable: true, value: () => combinedActionsString }
  });
}

function isValidActionType(action) {
  return isString(action) || isFunction(action) || isSymbol(action);
}

