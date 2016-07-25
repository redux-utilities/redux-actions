import isFunction from 'lodash/isFunction';
import identity from 'lodash/identity';
import isNil from 'lodash/isNil';
import isSymbol from 'lodash/isSymbol';
import isPlainObject from 'lodash/isPlainObject';

export default function handleAction(type, reducers, defaultState) {
  const typeValue = isSymbol(type)
    ? type
    : type.toString();

  const [nextReducer, throwReducer] = isFunction(reducers)
    ? [reducers, reducers]
    : [reducers.next, reducers.throw].map(reducer => (isNil(reducer) ? identity : reducer));

  return (state = defaultState, action) => {
    let newState = state;
    
    // object will be the only situation that you may need to default assignment to happen.
    if (isPlainObject(defaultState)) {
      newState = Object.assign({}, state || {}, defaultState);
    }
    
    if (action.type !== typeValue) {
      return newState;
    }

    return (action.error === true ? throwReducer : nextReducer)(newState, action);
  };
}
