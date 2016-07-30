import isFunction from 'lodash/isFunction';
import identity from 'lodash/identity';
import isNil from 'lodash/isNil';
import includes from 'lodash/includes';
import isSymbol from 'lodash/isSymbol';
import { FSA_TYPE_DELIMITER } from './combineActions';

export default function handleAction(handlee, reducers, defaultState) {
  const typeValue = isSymbol(handlee)
    ? handlee
    : handlee.toString().split(FSA_TYPE_DELIMITER);

  const [nextReducer, throwReducer] = isFunction(reducers)
    ? [reducers, reducers]
    : [reducers.next, reducers.throw].map(reducer => (isNil(reducer) ? identity : reducer));

  return (state = defaultState, action) => {
    const { type } = action;
    if (isSymbol(typeValue)) {
      if (type !== typeValue) {
        return state;
      }
    } else if (!includes(typeValue, type)) {
      return state;
    }
    return (action.error === true ? throwReducer : nextReducer)(state, action);
  };
}
