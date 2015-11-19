function identity(t) {
  return t;
}

export default function createAction(type, actionCreator, metaCreator) {
  const finalActionCreator = typeof actionCreator === 'function'
    ? actionCreator
    : identity;

  return (...args) => {
    const payload = finalActionCreator(...args);
    const action = {
      type,
      payload
    };

    if (payload instanceof Error) {
      // Handle FSA errors where the payload is an Error object. Set error.
      action.error = true;
    }

    if (typeof metaCreator === 'function') {
      action.meta = metaCreator(...args);
    }

    return action;
  };
}
