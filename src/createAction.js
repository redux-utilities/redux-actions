function identity(t) {
  return t;
}

export default function createAction(type, actionCreator = identity, metaCreator = () => ({}) ) {
  return (...args) => {
    const action = {
      type,
      payload: actionCreator(...args),
      meta: metaCreator(...args)
    };

    return action;
  };
}
