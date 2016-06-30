function isFunction(val) {
  return typeof val === 'function';
}

export default function handleAction(type, reducers, defaultState) {
  const typeValue = isFunction(type)
    ? type.toString()
    : type;

  const [nextReducer, throwReducer] = isFunction(reducers)
    ? [reducers, reducers]
    : [reducers.next, reducers.throw];

  if (nextReducer === undefined || throwReducer === undefined) {
    throw new TypeError(
      'reducers argument must be either a function or an object of shape {next, throw}'
    );
  }

  return (state = defaultState, action) => {
    // If action type does not match, return previous state
    if (action.type !== typeValue) return state;

    const reducer = action.error === true ? throwReducer : nextReducer;

    return isFunction(reducer)
      ? reducer(state, action)
      : state;
  };
}
