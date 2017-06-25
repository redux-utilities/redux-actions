import camelCase from './camelCase';
import ownKeys from './ownKeys';
import isPlainObject from 'lodash/isPlainObject';
import includes from 'lodash/includes';

const defaultNamespace = '/';

function hasGeneratorInterface(handler) {
  const generatorFnNames = ['next', 'throw'];
  const keys = Object.getOwnPropertyNames(handler);
  const onlyInterfaceFns = keys.every((fnName) => includes(generatorFnNames, fnName));
  return (keys.length && keys.length <= 2 && onlyInterfaceFns);
}

const flattenBy = (predicate) =>
function flatten(
  map,
  namespace = defaultNamespace,
  partialFlatMap = {},
  partialFlatActionType = ''
) {
  function connectNamespace(type) {
    return partialFlatActionType
      ? `${partialFlatActionType}${namespace}${type}`
      : type;
  }

  ownKeys(map).forEach(type => {
    const nextNamespace = connectNamespace(type);
    const mapValue = map[type];

    if (!predicate(mapValue)) {
      partialFlatMap[nextNamespace] = map[type];
    } else {
      flatten(map[type], namespace, partialFlatMap, nextNamespace);
    }
  });

  return partialFlatMap;
};

const flattenActionMap = flattenBy((node) => isPlainObject(node));
const flattenReducerMap = flattenBy((node) => isPlainObject(node) && !hasGeneratorInterface(node));

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

  const nestedActionCreators = {};
  Object
    .getOwnPropertyNames(flatActionCreators)
    .forEach(type => unflatten(type, nestedActionCreators, type.split(namespace)));
  return nestedActionCreators;
}

export { flattenActionMap, flattenReducerMap, unflattenActionCreators, defaultNamespace };
