import identity from 'lodash/identity';
import camelCase from 'lodash/camelCase';
import isPlainObject from 'lodash/isPlainObject';
import isArray from 'lodash/isArray';
import reduce from 'lodash/reduce';
import isString from 'lodash/isString';
import isFunction from 'lodash/isFunction';
import createAction from './createAction';

export default function createActions(actionsMap, ...identityActions) {
  if (identityActions.every(isString)) {
    if (isString(actionsMap)) {
      return fromIdentityActions([actionsMap, ...identityActions]);
    } else if (isPlainObject(actionsMap)) {
      return { ...fromActionsMap(actionsMap), ...fromIdentityActions(identityActions) };
    }
  }
  throw new TypeError('Expected optional object followed by string action types');
}

function isValidActionsMapValue(actionsMapValue) {
  if (isFunction(actionsMapValue)) {
    return true;
  } else if (isArray(actionsMapValue)) {
    const [payload = identity, meta] = actionsMapValue;
    return isFunction(payload) && isFunction(meta);
  }
  return false;
}

function fromActionsMap(actionsMap) {
  return reduce(actionsMap, (actionCreatorsMap, actionsMapValue, type) => {
    if (!isValidActionsMapValue(actionsMapValue)) {
      throw new TypeError(
        'Expected function, undefined, or array with payload and meta ' +
        `functions for ${type}`);
    }

    const actionCreator = isArray(actionsMapValue)
      ? createAction(type, ...actionsMapValue)
      : createAction(type, actionsMapValue);

    return { ...actionCreatorsMap, [camelCase(type)]: actionCreator };
  }, {});
}

function fromIdentityActions(identityActions) {
  return fromActionsMap(
    identityActions.reduce(
      (actionsMap, actionType) => ({ ...actionsMap, [actionType]: identity }), {}
    )
  );
}
