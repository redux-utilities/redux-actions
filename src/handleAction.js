function isFunction(val) {
  return typeof val === 'function';
}

export default function handleAction(type, reducers, defaultState) {
  const typeValue = isFunction(type)
    ? type.toString()
    : type;

  const nextReducer = isFunction(reducers) ? reducers : reducers.next;
  const throwReducer = isFunction(reducers) ? reducers : reducers.throw;

  return (state = defaultState, action) => {
    // If action type does not match, return previous state
    if (action.type !== typeValue) return state;

    const reducer = action.error === true ? throwReducer : nextReducer;

    return isFunction(reducer)
      ? reducer(state, action)
      : state;
  };
}
