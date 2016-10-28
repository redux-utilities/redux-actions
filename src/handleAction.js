import isFunction from 'lodash/isFunction';
import identity from 'lodash/identity';
import isNil from 'lodash/isNil';
import isUndefined from 'lodash/isUndefined';
import includes from 'lodash/includes';
import invariant from 'invariant';
import { isFSA } from 'flux-standard-action';
import { ACTION_TYPE_DELIMITER } from './combineActions';

export default function handleAction(actionType, reducers, defaultState) {
  const actionTypes = actionType.toString().split(ACTION_TYPE_DELIMITER);
  invariant(
    !isUndefined(defaultState),
    `defaultState for reducer handling ${actionTypes.join(', ')} should be defined`
  );

  const [nextReducer, throwReducer] = isFunction(reducers)
    ? [reducers, reducers]
    : [reducers.next, reducers.throw].map(reducer => (isNil(reducer) ? identity : reducer));

  return (state = defaultState, action) => {
    invariant(
      isFSA(action),
      'The FSA spec mandates an action object with a type. Try using the createAction(s) method.'
    );

    if (!includes(actionTypes, action.type.toString())) {
      return state;
    }

    return (action.error === true ? throwReducer : nextReducer)(state, action);
  };
}
