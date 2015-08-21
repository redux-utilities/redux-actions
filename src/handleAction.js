import { isError } from 'flux-standard-action';

function isFunction(val) {
  return typeof val === 'function';
}

function inArray(array, val) {
  return array.indexOf(val) !== -1;
}

function getHandlerKey(action) {
  if (isError(action)) return 'error';

  if (action.sequence && inArray(['start', 'complete'], action.sequence.type)) {
    return action.sequence.type;
  }

  return 'next';
}

export default function handleAction(type, reducers) {
  return (...args) => {
    if (args.length < 2) {
      throw new Error(`reducer for ${type} must be called with (state, action, ...extraArgs)`);
    }

    // Fetch variables manually, destructuring causes unnecessary
    // loop + extra allocations - https://gist.github.com/tappleby/f1933823c52224870014
    const state = args[0];
    const action = args[1];

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
      ? reducer(...args)
      : state;
  };
}
