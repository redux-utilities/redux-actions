function identity(t) {
  return t;
}

export default function createAction(type, actionCreator, metaCreator) {
  const finalActionCreator = typeof actionCreator === 'function'
    ? actionCreator
    : identity;

  const finalMetaCreator = typeof metaCreator === 'function'
    ? metaCreator
    : identity;

  return (...args) => ({
    type,
    payload: finalActionCreator(...args),
    meta: finalMetaCreator(...args)
  });
}
