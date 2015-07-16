import { isError } from 'flux-standard-action';

function isFunction(val) {
  return typeof val === 'function';
}

function inArray(array, val) {
  return array.indexOf(val) !== -1;
}

function getHandlerKey(action) {
  if (isError(action)) return 'throw';

  if (action.sequence && inArray(['start', 'return'], action.sequence.type)) {
    return action.sequence.type;
  }

  return 'next';
}

export default function handleAction(type, reducers) {
  return (state, action) => {
    // If action type does not match, return previous state
    if (action.type !== type) return state;

    const handlerKey = getHandlerKey(action);

    // If function is passed instead of map, use as reducer
    const reducersMap = isFunction(reducers)
      ? { next: reducers }
      : reducers;

    // Otherwise, assume an action map was passed
    const reducer = reducersMap[handlerKey];

    return isFunction(reducer)
      ? reducer(state, action)
      : state;
  };
}
