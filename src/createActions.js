import identity from 'lodash/identity';
import camelCase from './camelCase';
import isPlainObject from 'lodash/isPlainObject';
import isArray from 'lodash/isArray';
import every from 'lodash/every';
import values from 'lodash/values';
import last from 'lodash/last';
import isString from 'lodash/isString';
import isEmpty from 'lodash/isEmpty';
import isFunction from 'lodash/isFunction';
import createAction from './createAction';
import invariant from 'invariant';
import { defaultNamespace, flattenActions, unflattenActions } from './namespaceActions';

export default function createActions(actionsMap, ...identityActions) {
  const namespace = isPlainObject(last(identityActions))
    ? identityActions.pop().namespace
    : defaultNamespace
  invariant(
    identityActions.every(isString) &&
    (isString(actionsMap) || isPlainObject(actionsMap)),
    'Expected optional object followed by string action types'
  );
  if (isString(actionsMap)) {
    return fromIdentityActions([actionsMap, ...identityActions]);
  }
  return {
    ...fromActionsMap(actionsMap, namespace),
    ...fromIdentityActions(identityActions)
  };
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

function fromActionsMap(actionsMap, namespace) {
  const flattenedActionsMap = flattenActions(actionsMap, namespace);
  const flattenedActionCreators = Object.keys(flattenedActionsMap).reduce((actionCreatorsMap, type) => {
    const actionsMapValue = flattenedActionsMap[type];
    invariant(
      isValidActionsMapValue(actionsMapValue),
      'Expected function, undefined, or array with payload and meta ' +
      `functions for ${type}`
    );
    const actionCreator = isArray(actionsMapValue)
      ? createAction(type, ...actionsMapValue)
      : createAction(type, actionsMapValue);
    return { ...actionCreatorsMap, [type]: actionCreator };
  }, {});
  return unflattenActions(flattenedActionCreators, namespace);
}

function fromIdentityActions(identityActions) {
  return fromActionsMap(identityActions.reduce(
    (actionsMap, actionType) => ({ ...actionsMap, [actionType]: identity })
  , {}));
}
