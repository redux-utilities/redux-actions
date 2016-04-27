import ownKeys from './ownKeys';
import createAction from './createAction';
import camelize from './camelize';

// creates a map of camelized actionTypes to the corresponding actions
export default function createActions (actionTypes, transform = camelize) {
  return ownKeys(actionTypes)
    .reduce((acc, type) => ({
      ...acc, [transform(type)]: createAction(type)
    }), {});
}
