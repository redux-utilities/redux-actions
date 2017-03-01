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
  flattenActionMap,
  unflattenActionCreators
} from './namespaceActions';

function getFullOptions(options = {}) {
  return defaults(options, { namespace: defaultNamespace });
}

export default function createActions(actionMap, ...identityActions) {
  const { namespace } = getFullOptions(
    isPlainObject(last(identityActions)) ? identityActions.pop() : {}
  );
  invariant(
    identityActions.every(isString) &&
    (isString(actionMap) || isPlainObject(actionMap)),
    'Expected optional object followed by string action types'
  );
  if (isString(actionMap)) {
    return actionCreatorsFromIdentityActions([actionMap, ...identityActions]);
  }
  const flatActionsMap = flattenActionMap(actionMap, namespace);
  const flatActionCreators = toActionCreators(flatActionsMap);
  const actionCreatorsFromActionsMap = unflattenActionCreators(
    flatActionCreators,
    namespace
  );
  return {
    ...actionCreatorsFromActionsMap,
    ...actionCreatorsFromIdentityActions(identityActions)
  };
}

function isValidActionsMapValue(actionMapValue) {
  if (isFunction(actionMapValue)) {
    return true;
  } else if (isArray(actionMapValue)) {
    const [payload = identity, meta] = actionMapValue;

    return isFunction(payload) && isFunction(meta);
  }
  return false;
}

function toActionCreators(actionMap) {
  return arrayToObject(Object.keys(actionMap), (partialActionCreators, type) => {
    const actionMapValue = actionMap[type];
    invariant(
      isValidActionsMapValue(actionMapValue),
      'Expected function, undefined, or array with payload and meta ' +
      `functions for ${type}`
    );
    const actionCreator = isArray(actionMapValue)
      ? createAction(type, ...actionMapValue)
      : createAction(type, actionMapValue);
    return { ...partialActionCreators, [type]: actionCreator };
  });
}

function actionCreatorsFromIdentityActions(identityActions) {
  const actionMap = arrayToObject(identityActions, (partialActionsMap, type) => ({
    ...partialActionsMap,
    [type]: identity
  }));
  const actionCreators = toActionCreators(actionMap);
  return arrayToObject(Object.keys(actionCreators), (partialActionCreators, type) => ({
    ...partialActionCreators,
    [camelCase(type)]: actionCreators[type]
  }));
}
