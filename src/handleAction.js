import isFunction from 'lodash/isFunction';
import isPlainObject from 'lodash/isPlainObject';
import identity from 'lodash/identity';
import isNil from 'lodash/isNil';
import isUndefined from 'lodash/isUndefined';
import includes from 'lodash/includes';
import invariant from 'invariant';
import { ACTION_TYPE_DELIMITER } from './combineActions';

export default function handleAction(typeObj, reducer = identity, defaultState) {
  const type = typeObj.toString();
  const types = type.split(ACTION_TYPE_DELIMITER);
  // Common-case optimization: most handlers are only handling one action
  const actionMatches = types.length === 1 ?
    actionType => actionType === type :
    actionType => includes(types, actionType);
  
  invariant(
    !isUndefined(defaultState),
    `defaultState for reducer handling ${types.join(', ')} should be defined`
  );
  invariant(
    isFunction(reducer) || isPlainObject(reducer),
    'Expected reducer to be a function or object with next and throw reducers'
  );

  const [nextReducer, throwReducer] = isFunction(reducer)
    ? [reducer, reducer]
    : [reducer.next, reducer.throw].map(aReducer => (isNil(aReducer) ? identity : aReducer));

  return (state = defaultState, action) =>
    actionMatches(action.type.toString()) ?
      (action.error === true ? throwReducer : nextReducer)(state, action) :
      state
}
