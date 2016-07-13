function isFunction(val) {
  return typeof val === 'function';
}

function identity(state) {
  return state;
}

export default function handleAction(type, reducers, defaultState) {
  const typeValue = isFunction(type)
    ? type.toString()
    : type;

  const [nextReducer = identity, throwReducer = identity] = isFunction(reducers)
    ? [reducers, reducers]
    : [reducers.next, reducers.throw];
  // TODO: warn if both reducers are undefined or identity; that would make this a no-op reducer.

  // TODO: relace this kludge with flow or some other proper type checker.
  if (!isFunction(nextReducer)) {
    throw new TypeError(
      `If given, reducers or reducers.next must be a function (got ${nextReducer})`
    );
  }
  if (!isFunction(throwReducer)) {
    throw new TypeError(
      `If given, reducers or reducers.throw must be a function (got ${throwReducer})`
    );
  }

  return (state = defaultState, action) => {
    // If action type does not match, return previous state
    if (action.type !== typeValue) return state;

    const reducer = action.error === true ? throwReducer : nextReducer;

    return reducer(state, action);
  };
}
