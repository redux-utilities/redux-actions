function isFunction(val) {
  return typeof val === 'function';
}

function coerceReducer(reducer) {
  return isFunction(reducer) ? reducer : (state, action) => state
}

export default function handleAction(type, reducers, defaultState) {
  const typeValue = isFunction(type)
    ? type.toString()
    : type;

  const [nextReducer, throwReducer] = isFunction(reducers)
    ? [reducers, reducers]
    : [reducers.next, reducers.throw].map(coerceReducer);
  // TODO: warn if both reducers are not functions; that would make this a no-op reducer.

  return (state = defaultState, action) => {
    // If action type does not match, return previous state
    if (action.type !== typeValue) return state;

    const reducer = action.error === true ? throwReducer : nextReducer;

    return reducer(state, action)
  };
}
