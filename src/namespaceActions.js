import camelCase from './camelCase';
import isPlainObject from 'lodash/isPlainObject';

const defaultNamespace = '/';

function flattenActionsMap(
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

    if (!isPlainObject(actionsMapValue)) {
      flattenedActions[nextActionType] = actionsMap[actionType];
    } else {
      flattenActionsMap(actionsMap[actionType], namespace, flattenedActions, nextActionType);
    }
  });
  return flattenedActions;
}

function unflattenActionCreators(actionCreatorsMap, namespace = defaultNamespace) {
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

export { flattenActionsMap, unflattenActionCreators };
