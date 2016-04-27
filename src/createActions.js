import ownKeys from './ownKeys';
import createAction from './createAction';

// MY_CONSTANT_NAME => myConstantName
const camelize = s => s.toLowerCase()
                       .replace(/_\w/g, x => x[1].toUpperCase());

// creates a map of camelized actionTypes to the corresponding actions
export default function createActions (actionTypes, transform = camelize) {
  return Object.keys(actionTypes)
    .reduce((acc, type) => ({
      ...acc, [transform(type)]: createAction(type)
    }), {});
}
