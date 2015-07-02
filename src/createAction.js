function identity(t) {
  return t;
}

export default function createAction(type, actionCreator) {
  const finalActionCreator = typeof actionCreator === 'function'
    ? actionCreator
    : identity;

  return (...args) => ({
    type,
    payload: finalActionCreator(...args)
  });
}
