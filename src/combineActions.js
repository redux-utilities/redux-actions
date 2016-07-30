import isString from 'lodash/isString';
import isFunction from 'lodash/isFunction';
import isEmpty from 'lodash/isEmpty';

export const FSA_TYPE_DELIMITER = '|fsa-type-delimiter|';

export default function combineActions(...actions) {
  if (isEmpty(actions)|| !actions.every(isValidActionType)) {
    throw new TypeError('Expected each argument to be a string action type or an action creator');
  }

  const combinedActionsString = actions.map(type => type.toString()).join(FSA_TYPE_DELIMITER);

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

