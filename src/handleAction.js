import isFunction from 'lodash/isFunction';
import identity from 'lodash/identity';
import isNil from 'lodash/isNil';
import includes from 'lodash/includes';
import isSymbol from 'lodash/isSymbol';
import { ACTION_DELIMITER } from './combineActions';

export default function handleAction(type, reducers, defaultState) {
  const typeValue = isSymbol(type)
    ? type
    : type.toString().split(ACTION_DELIMITER);

  const [nextReducer, throwReducer] = isFunction(reducers)
    ? [reducers, reducers]
    : [reducers.next, reducers.throw].map(reducer => (isNil(reducer) ? identity : reducer));

  return (state = defaultState, action) => {
    const actionType = action.type;
    if (isSymbol(typeValue)) {
      if (actionType !== typeValue) {
        return state;
      }
    } else if (!includes(typeValue, actionType)) {
      return state;
    }
    return (action.error === true ? throwReducer : nextReducer)(state, action);
  };
}
