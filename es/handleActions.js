function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

import handleAction from './handleAction';
import ownKeys from './ownKeys';
import reduceReducers from 'reduce-reducers';

export default function handleActions(handlers, defaultState) {
  var reducers = ownKeys(handlers).map(function (type) {
    return handleAction(type, handlers[type], defaultState);
  });
  var reducer = reduceReducers.apply(undefined, _toConsumableArray(reducers));
  return function (state, action) {
    return reducer(state, action);
  };
}