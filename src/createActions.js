import camelCase from './camelCase';
import identity from 'lodash/identity';
import isPlainObject from 'lodash/isPlainObject';
import isArray from 'lodash/isArray';
import last from 'lodash/last';
import isString from 'lodash/isString';
import isFunction from 'lodash/isFunction';
import isNil from 'lodash/isNil';
import createAction from './createAction';
import invariant from 'invariant';
import arrayToObject from './arrayToObject';
import {
  flattenActionMap,
  unflattenActionCreators
} from './flattenUtils';

export default function createActions(actionMap, ...identityActions) {
  const options = isPlainObject(last(identityActions))
    ? identityActions.pop()
    : {};
  invariant(
    identityActions.every(isString) &&
    (isString(actionMap) || isPlainObject(actionMap)),
    'Expected optional object followed by string action types'
  );
  if (isString(actionMap)) {
    return actionCreatorsFromIdentityActions([actionMap, ...identityActions]);
  }
  return {
    ...actionCreatorsFromActionMap(actionMap, options),
    ...actionCreatorsFromIdentityActions(identityActions)
  };
}

function actionCreatorsFromActionMap(actionMap, namespace) {
  const flatActionMap = flattenActionMap(actionMap, namespace);
  const flatActionCreators = actionMapToActionCreators(flatActionMap);
  return unflattenActionCreators(flatActionCreators, namespace);
}

function actionMapToActionCreators(actionMap) {
  function isValidActionMapValue(actionMapValue) {
    if (isFunction(actionMapValue) || isNil(actionMapValue)) {
      return true;
    } else if (isArray(actionMapValue)) {
      const [payload = identity, meta] = actionMapValue;
      return isFunction(payload) && isFunction(meta);
    }
    return false;
  }

  return arrayToObject(Object.keys(actionMap), (partialActionCreators, type) => {
    const actionMapValue = actionMap[type];
    invariant(
      isValidActionMapValue(actionMapValue),
      'Expected function, undefined, null, or array with payload and meta ' +
      `functions for ${type}`
    );
    const actionCreator = isArray(actionMapValue)
      ? createAction(type, ...actionMapValue)
      : createAction(type, actionMapValue);
    return { ...partialActionCreators, [type]: actionCreator };
  });
}

function actionCreatorsFromIdentityActions(identityActions) {
  const actionMap = arrayToObject(
    identityActions,
    (partialActionMap, type) => ({ ...partialActionMap, [type]: identity })
  );
  const actionCreators = actionMapToActionCreators(actionMap);
  return arrayToObject(
    Object.keys(actionCreators),
    (partialActionCreators, type) => ({
      ...partialActionCreators,
      [camelCase(type)]: actionCreators[type]
    })
  );
}
