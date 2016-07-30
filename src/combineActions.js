import isString from 'lodash/isString';
import isFunction from 'lodash/isFunction';
import isEmpty from 'lodash/isEmpty';
import toString from 'lodash/toString';

export const ACTION_DELIMITER = '|redux-action-delimiter|';

export default function combineActions(...actions) {
  if (isEmpty(actions) || !actions.every(isValidActionType)) {
    throw new TypeError('Expected each argument to be a string action type or an action creator');
  }

  const combinedActionsString = actions.map(toString).join(ACTION_DELIMITER);

  return Object.create(null, {
    toString: {
      enumerable: true,
      writable: false,
      configurable: false,
      value() {
        return combinedActionsString;
      }
    }
  });
}

function isValidActionType(action) {
  return isString(action) || isFunction(action);
}

