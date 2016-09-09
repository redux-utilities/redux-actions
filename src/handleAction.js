import isFunction from 'lodash/isFunction';
import isPlainObject from 'lodash/isPlainObject';
import identity from 'lodash/identity';
import isNil from 'lodash/isNil';
import includes from 'lodash/includes';
import { ACTION_TYPE_DELIMITER } from './combineActions';

export default function handleAction(actionType, reducer = {}, defaultState) {
  const actionTypes = actionType.toString().split(ACTION_TYPE_DELIMITER);

  if (!isFunction(reducer) && !isPlainObject(reducer)) {
    throw new TypeError('Expected reducer to be a function or object with next and throw reducers');
  }

  const [nextReducer, throwReducer] = isFunction(reducer)
    ? [reducer, reducer]
    : [reducer.next, reducer.throw].map(aReducer => (isNil(aReducer) ? identity : aReducer));

  return (state = defaultState, action) => {
    if (!includes(actionTypes, action.type.toString())) {
      return state;
    }

    return (action.error === true ? throwReducer : nextReducer)(state, action);
  };
}
