import isFunction from 'lodash/isFunction';
import camelCase from './camelCase';
import isArray from 'lodash/isArray';

const defaultNamespace = '/';

function flattenActions(
  actionsMap,
  namespace = defaultNamespace,
  flattenedActions = {},
  flattenedActionType = ''
) {
  function getNextActionType(actionType) {
    return flattenedActionType ? `${flattenedActionType}${namespace}${actionType}` : actionType;
  }
  Object.getOwnPropertyNames(actionsMap).forEach(actionType => {
    const nextActionType = getNextActionType(actionType);
    const actionsMapValue = actionsMap[actionType];
    if (isFunction(actionsMapValue) || isArray(actionsMapValue)) {
      flattenedActions[nextActionType] = actionsMap[actionType];
    } else {
      flattenActions(actionsMap[actionType], namespace, flattenedActions, nextActionType);
    }
  });
  return flattenedActions;
}

function unflattenActions(actionCreatorsMap, namespace = defaultNamespace) {
  function unflatten(
    unflattenedActions = {},
    flattenedActionType,
    actionTypePath,
  ) {
    const nextActionType = camelCase(actionTypePath.shift());
    if (actionTypePath.length) {
      if (!unflattenedActions[nextActionType]) {
        unflattenedActions[nextActionType] = {};
      }
      unflatten(unflattenedActions[nextActionType], flattenedActionType, actionTypePath);
    } else {
      unflattenedActions[nextActionType] = actionCreatorsMap[flattenedActionType];
    }
  }
  const unflattenedActions = {};
  Object
    .getOwnPropertyNames(actionCreatorsMap)
    .forEach(actionType => unflatten(unflattenedActions, actionType, actionType.split(namespace)));
  return unflattenedActions;
}

export { flattenActions, unflattenActions };
