import isMap from 'lodash/isMap';
import { DEFAULT_NAMESPACE } from '../constants';
import ownKeys from './ownKeys';

function get(key, x) {
  return isMap(x) ? x.get(key) : x[key];
}

export default predicate =>
  function flatten(
    map,
    { namespace = DEFAULT_NAMESPACE, prefix } = {},
    partialFlatMap = {},
    partialFlatActionType = ''
  ) {
    function connectNamespace(type) {
      return partialFlatActionType
        ? `${partialFlatActionType}${namespace}${type}`
        : type;
    }

    function connectPrefix(type) {
      if (partialFlatActionType || !prefix) {
        return type;
      }

      return `${prefix}${namespace}${type}`;
    }

    ownKeys(map).forEach(type => {
      const nextNamespace = connectPrefix(connectNamespace(type));
      const mapValue = get(type, map);

      if (predicate(mapValue)) {
        flatten(mapValue, { namespace, prefix }, partialFlatMap, nextNamespace);
      } else {
        partialFlatMap[nextNamespace] = mapValue;
      }
    });

    return partialFlatMap;
  };
