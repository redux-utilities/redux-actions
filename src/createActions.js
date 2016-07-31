import identity from 'lodash/identity';
import camelCase from 'lodash/camelCase';
import isPlainObject from 'lodash/isPlainObject';
import reduce from 'lodash/reduce';
import isString from 'lodash/isString';
import isFunction from 'lodash/isFunction';
import createAction from './createAction';

function isValidActionsMapValue(actionsMapValue) {
  if (isFunction(actionsMapValue)) {
    return true;
  } else if (isPlainObject(actionsMapValue)) {
    const { payload = identity, meta } = actionsMapValue;
    return isFunction(payload) && isFunction(meta);
  }
  return false;
}

function fromActionsMap(actionsMap) {
  return reduce(actionsMap, (actionCreatorsMap, actionsMapValue = identity, type) => {
    if (!isValidActionsMapValue(actionsMapValue)) {
      throw new TypeError(`
        Expected function, plain object with payload and meta keys, or undefined for ${type}`);
    }
    let actionCreator;
    if (isPlainObject(actionsMapValue)) {
      const { payload = identity, meta } = actionsMapValue;
      actionCreator = createAction(type, payload, meta);
    } else {
      actionCreator = createAction(type, actionsMapValue);
    }
    return { ...actionCreatorsMap, [camelCase(type)]: actionCreator };
  }, {});
}

function fromActionTypeStrings(...types) {
  return fromActionsMap(
    types.reduce((actionsMap, action) => ({ ...actionsMap, [action]: undefined }), {})
  );
}

export default function createActions(actionsMap, ...actionTypes) {
  if (actionTypes.every(isString)) {
    if (isString(actionsMap)) {
      return fromActionTypeStrings(actionsMap, ...actionTypes);
    } else if (isPlainObject(actionsMap)) {
      return { ...fromActionsMap(actionsMap), ...fromActionTypeStrings(...actionTypes) };
    }
  }
  throw new TypeError('Expected (optional) object followed by string action types');
}
