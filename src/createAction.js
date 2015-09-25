function identity(t) {
  return t;
}

export default function createAction(type, payloadCreator, metaCreator) {
  const finalPayloadCreator = typeof payloadCreator === 'function'
    ? payloadCreator
    : identity;

  function actionCreator(...args) {
    const action = {
      type,
      payload: finalPayloadCreator(...args)
    };

    if (args.length === 1 && args[0] instanceof Error) {
      // Handle FSA errors where the payload is an Error object. Set error.
      action.error = true;
    }

    if (typeof metaCreator === 'function') {
      action.meta = metaCreator(...args);
    }

    return action;
  }

  actionCreator.toString = () => type;

  return actionCreator;
}
