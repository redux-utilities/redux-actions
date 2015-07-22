function identity(t) {
  return t;
}

export default function createAction(type, actionCreator, metaCreator) {
  if (!type) throw new Error('createAction requires a type as the first argument');

  const finalActionCreator = typeof actionCreator === 'function'
    ? actionCreator
    : identity;

  return (...args) => {
    const action = {
      type,
      payload: finalActionCreator(...args)
    };

    if (typeof metaCreator === 'function') action.meta = metaCreator(...args);

    return action;
  };
}
