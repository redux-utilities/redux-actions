function isFunction(val) {
  return typeof val === 'function';
}

export default function handleAction(type, reducers, defaultState) {
  const typeValue = isFunction(type)
    ? type.toString()
    : type;

  return (state = defaultState, action) => {
    // If action type does not match, return previous state
    if (action.type !== typeValue) return state;

    const handlerKey = action.error === true ? 'throw' : 'next';

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
