var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

import identity from 'lodash/identity';
import camelCase from 'lodash/camelCase';
import isPlainObject from 'lodash/isPlainObject';
import isArray from 'lodash/isArray';
import reduce from 'lodash/reduce';
import isString from 'lodash/isString';
import isFunction from 'lodash/isFunction';
import createAction from './createAction';
import invariant from 'invariant';

export default function createActions(actionsMap) {
  for (var _len = arguments.length, identityActions = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    identityActions[_key - 1] = arguments[_key];
  }

  invariant(identityActions.every(isString) && (isString(actionsMap) || isPlainObject(actionsMap)), 'Expected optional object followed by string action types');
  if (isString(actionsMap)) {
    return fromIdentityActions([actionsMap].concat(identityActions));
  }
  return _extends({}, fromActionsMap(actionsMap), fromIdentityActions(identityActions));
}

function isValidActionsMapValue(actionsMapValue) {
  if (isFunction(actionsMapValue)) {
    return true;
  } else if (isArray(actionsMapValue)) {
    var _actionsMapValue = _slicedToArray(actionsMapValue, 2),
        _actionsMapValue$ = _actionsMapValue[0],
        payload = _actionsMapValue$ === undefined ? identity : _actionsMapValue$,
        meta = _actionsMapValue[1];

    return isFunction(payload) && isFunction(meta);
  }
  return false;
}

function fromActionsMap(actionsMap) {
  return reduce(actionsMap, function (actionCreatorsMap, actionsMapValue, type) {
    invariant(isValidActionsMapValue(actionsMapValue), 'Expected function, undefined, or array with payload and meta ' + ('functions for ' + type));
    var actionCreator = isArray(actionsMapValue) ? createAction.apply(undefined, [type].concat(_toConsumableArray(actionsMapValue))) : createAction(type, actionsMapValue);

    return _extends({}, actionCreatorsMap, _defineProperty({}, camelCase(type), actionCreator));
  }, {});
}

function fromIdentityActions(identityActions) {
  return fromActionsMap(identityActions.reduce(function (actionsMap, actionType) {
    return _extends({}, actionsMap, _defineProperty({}, actionType, identity));
  }, {}));
}