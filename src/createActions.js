import camelCase from './camelCase';
import identity from 'lodash/identity';
import isPlainObject from 'lodash/isPlainObject';
import isArray from 'lodash/isArray';
import last from 'lodash/last';
import isString from 'lodash/isString';
import defaults from 'lodash/defaults';
import isFunction from 'lodash/isFunction';
import createAction from './createAction';
import invariant from 'invariant';
import arrayToObject from './arrayToObject';
import {
  defaultNamespace,
  flattenActionsMap,
  unflattenActionCreators
} from './namespaceActions';

function getFullOptions(options = {}) {
  return defaults(options, { namespace: defaultNamespace });
}

export default function createActions(actionsMap, ...identityActions) {
  const { namespace } = getFullOptions(
    isPlainObject(last(identityActions)) ? identityActions.pop() : {}
  );
  invariant(
    identityActions.every(isString) &&
    (isString(actionsMap) || isPlainObject(actionsMap)),
    'Expected optional object followed by string action types'
  );
  if (isString(actionsMap)) {
    return actionCreatorsFromIdentityActions([actionsMap, ...identityActions]);
  }
  return {
    ...unflattenActionCreators(
      toActionCreators(flattenActionsMap(actionsMap, namespace)),
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

function toActionCreators(actionsMap) {
  return arrayToObject(Object.keys(actionsMap), (partialActionCreators, type) => {
    const actionsMapValue = actionsMap[type];
    invariant(
      isValidActionsMapValue(actionsMapValue),
      'Expected function, undefined, or array with payload and meta ' +
      `functions for ${type}`
    );
    const actionCreator = isArray(actionsMapValue)
      ? createAction(type, ...actionsMapValue)
      : createAction(type, actionsMapValue);
    return { ...partialActionCreators, [type]: actionCreator };
  });
}

function actionCreatorsFromIdentityActions(identityActions) {
  const actionsMap = arrayToObject(identityActions, (partialActionsMap, type) => ({
    ...partialActionsMap,
    [type]: identity
  }));
  const actionCreators = toActionCreators(actionsMap);
  return arrayToObject(Object.keys(actionCreators), (partialActionCreators, type) => ({
    ...partialActionCreators,
    [camelCase(type)]: actionCreators[type]
  }));
}
