import { isError } from 'flux-standard-action';

function isFunction(val) {
  return typeof val === 'function';
}

export default function handleAction(type, reducers) {
  return (state, action) => {
    // If action type does not match, return previous state
    if (action.type !== type) return state;

    const handlerKey = isError(action) ? 'throw' : 'next';

    // If function is passed instead of map, use as reducer
    if (isFunction(reducers)) {
      reducers.next = reducers.throw = reducers;
    }

    // Otherwise, assume an action map was passed
    const reducer = reducers[handlerKey];

    return isFunction(reducer)
      ? reducer(state, action)
      : state;
  };
}
