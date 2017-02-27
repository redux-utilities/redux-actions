import camelCase from './camelCase';
import identity from 'lodash/identity';
import isPlainObject from 'lodash/isPlainObject';
import isArray from 'lodash/isArray';
import last from 'lodash/last';
import isString from 'lodash/isString';
import isFunction from 'lodash/isFunction';
import createAction from './createAction';
import invariant from 'invariant';
import { defaultNamespace, flattenActions, unflattenActions } from './namespaceActions';

export default function createActions(actionsMap, ...identityActions) {
  const namespace = isPlainObject(last(identityActions))
    ? identityActions.pop().namespace
    : defaultNamespace;
  invariant(
    identityActions.every(isString) &&
    (isString(actionsMap) || isPlainObject(actionsMap)),
    'Expected optional object followed by string action types'
  );
  if (isString(actionsMap)) {
    return actionCreatorsFromIdentityActions([actionsMap, ...identityActions]);
  }
  return {
    ...unflattenActions(
      attachActionCreators(flattenActions(actionsMap, namespace)),
      namespace
    ),
    ...actionCreatorsFromIdentityActions(identityActions)
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

function attachActionCreators(actionsMap) {
  return Object.keys(actionsMap).reduce((actionCreatorsMap, type) => {
    const actionsMapValue = actionsMap[type];
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
}

function actionCreatorsFromIdentityActions(identityActions) {
  const actionCreators = attachActionCreators(identityActions.reduce((actionsMap, actionType) => ({
    ...actionsMap,
    [actionType]: identity
  })
  , {}));
  return Object.keys(actionCreators).reduce((actionCreatorsMap, actionType) => ({
    ...actionCreatorsMap,
    [camelCase(actionType)]: actionCreators[actionType]
  }), {});
}
