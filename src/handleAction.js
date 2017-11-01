import isFunction from 'lodash/isFunction';
import isPlainObject from 'lodash/isPlainObject';
import identity from 'lodash/identity';
import isNil from 'lodash/isNil';
import isUndefined from 'lodash/isUndefined';
import includes from 'lodash/includes';
import invariant from 'invariant';
import { ACTION_TYPE_DELIMITER } from './combineActions';

export default function handleAction(type, reducer = identity, defaultState) {
  type = type.toString();
  const match = type.match(/^\/(.*)\/$/);
  const regexp = match ? new RegExp(match[1]) : undefined;
  const types = !regexp ? type.split(ACTION_TYPE_DELIMITER) : [];
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

  return (state = defaultState, action) => {
    const actionType = action.type ? action.type.toString() : undefined;
    if (!(actionType && (regexp && regexp.test(actionType) || includes(types, actionType)))) {
      return state;
    }

    return (action.error === true ? throwReducer : nextReducer)(state, action);
  };
}
