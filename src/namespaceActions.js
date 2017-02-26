const defaultNamespacer = '/';

function flattenActions(
  actionsMap,
  namespacer = defaultNamespacer,
  flattenedActions = {},
  flattenedActionType = ''
) {
  function getNextActionType(actionType) {
    return flattenedActionType ? `${flattenedActionType}${namespacer}${actionType}` : actionType;
  }
  Object.getOwnPropertyNames(actionsMap).forEach(actionType => {
    const nextActionType = getNextActionType(actionType);
    if (typeof actionsMap[actionType] === 'function') {
      flattenedActions[nextActionType] = actionsMap[actionType];
    } else {
      flattenActions(actionsMap[actionType], namespacer, flattenedActions, nextActionType);
    }
  });
  return flattenedActions;
}

function unflattenActions(actionCreatorsMap, namespacer = defaultNamespacer) {
  function unflatten(
    unflattenedActions = {},
    flattenedActionType,
    actionTypePath,
  ) {
    const nextActionType = actionTypePath.shift();
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
    .forEach(actionType => unflatten(unflattenedActions, actionType, actionType.split(namespacer)));
  return unflattenedActions;
}

export { flattenActions, unflattenActions };
