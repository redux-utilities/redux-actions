import identity from 'lodash/identity';
import isFunction from 'lodash/isFunction';
import isNull from 'lodash/isNull';
import invariant from 'invariant';

export default function createAction(type, payloadCreator = identity, metaCreator) {
  invariant(
    isFunction(payloadCreator) || isNull(payloadCreator),
    'Expected payloadCreator to be a function, undefined or null'
  );

  const finalPayloadCreator = payloadCreator === null || payloadCreator === identity
    ? identity
    : (head, ...args) => head instanceof Error ?
        head : payloadCreator(head, ...args);
  
  const hasMeta = isFunction(metaCreator);

  const actionCreator = (...args) => {
    const payload = finalPayloadCreator(...args);
    const action = { type, error: payload instanceof Error };
    
    if (payload !== undefined) {
      action.payload = payload;
    }
    
    if (hasMeta) {
      action.meta = metaCreator(...args);
    }

    return action;
  };

  const typeStr = type.toString();
  actionCreator.toString = () => typeStr;

  return actionCreator;
}
