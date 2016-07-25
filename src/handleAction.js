import isFunction from 'lodash/isFunction';
import identity from 'lodash/identity';
import isNil from 'lodash/isNil';
import isSymbol from 'lodash/isSymbol';

export default function handleAction(type, reducers, defaultState) {
  const typeValue = isSymbol(type)
    ? type
    : type.toString();

  const [nextReducer, throwReducer] = isFunction(reducers)
    ? [reducers, reducers]
    : [reducers.next, reducers.throw].map(reducer => (isNil(reducer) ? identity : reducer));

  return (state = defaultState, action = {}) => {
    if (action.type !== typeValue) {
      return state;
    }

    return (action.error === true ? throwReducer : nextReducer)(state, action);
  };
}
