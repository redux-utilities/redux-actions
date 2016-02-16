function identity(t) {
  return t;
}

export default function createAction(type, actionCreator, metaCreator) {
  const finalActionCreator = typeof actionCreator === 'function'
    ? actionCreator
    : identity;

  return (...args) => {
    const hasError = args.length === 1 && args[0] instanceof Error;

    const action = {
      type,
      payload: hasError ? args[0] : finalActionCreator(...args)
    };

    if (hasError) {
      action.error = true;
    } else if (typeof metaCreator === 'function') {
      action.meta = metaCreator(...args);
    }

    return action;
  };
}
