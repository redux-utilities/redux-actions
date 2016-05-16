function identity(t) {
  return t;
}

export default function createAction(type, actionCreator, metaCreator) {
  const finalActionCreator = typeof actionCreator === 'function'
    ? actionCreator
    : identity;

  return (...args) => {
    const action = {
      type
    };

    const payload = finalActionCreator(...args);
    if (payload) {
      action.payload = payload;
    }

    if (args.length === 1 && args[0] instanceof Error) {
      // Handle FSA errors where the payload is an Error object. Set error.
      action.error = true;
    }

    if (typeof metaCreator === 'function') {
      action.meta = metaCreator(...args);
    }

    return action;
  };
}
