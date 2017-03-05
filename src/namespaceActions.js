import camelCase from './camelCase';
import isPlainObject from 'lodash/isPlainObject';

function flattenActionMap(
  actionMap,
  namespace = defaultNamespace,
  partialFlatActionMap = {},
  partialFlatActionType = ''
) {
  function connectNamespace(type) {
    return partialFlatActionType
      ? `${partialFlatActionType}${namespace}${type}`
      : type;
  }

  Object.getOwnPropertyNames(actionMap).forEach(type => {
    const nextNamespace = connectNamespace(type);
    const actionMapValue = actionMap[type];

    if (!isPlainObject(actionMapValue)) {
      partialFlatActionMap[nextNamespace] = actionMap[type];
    } else {
      flattenActionMap(actionMap[type], namespace, partialFlatActionMap, nextNamespace);
    }
  });
  return partialFlatActionMap;
}

function unflattenActionCreators(flatActionCreators, namespace = defaultNamespace) {
  function unflatten(
    flatActionType,
    partialNestedActionCreators = {},
    partialFlatActionTypePath = [],
  ) {
    const nextNamespace = camelCase(partialFlatActionTypePath.shift());
    if (partialFlatActionTypePath.length) {
      if (!partialNestedActionCreators[nextNamespace]) {
        partialNestedActionCreators[nextNamespace] = {};
      }
      unflatten(
        flatActionType, partialNestedActionCreators[nextNamespace], partialFlatActionTypePath
      );
    } else {
      partialNestedActionCreators[nextNamespace] = flatActionCreators[flatActionType];
    }
  }

  const partialNestedActionCreators = {};
  Object
    .getOwnPropertyNames(flatActionCreators)
    .forEach(type => unflatten(type, partialNestedActionCreators, type.split(namespace)));
  return partialNestedActionCreators;
}

export { flattenActionMap, unflattenActionCreators };
export const defaultNamespace = '/';
