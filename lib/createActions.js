'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = createActions;

var _identity = require('lodash/identity');

var _identity2 = _interopRequireDefault(_identity);

var _camelCase = require('lodash/camelCase');

var _camelCase2 = _interopRequireDefault(_camelCase);

var _isPlainObject = require('lodash/isPlainObject');

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

var _isArray = require('lodash/isArray');

var _isArray2 = _interopRequireDefault(_isArray);

var _reduce = require('lodash/reduce');

var _reduce2 = _interopRequireDefault(_reduce);

var _isString = require('lodash/isString');

var _isString2 = _interopRequireDefault(_isString);

var _isFunction = require('lodash/isFunction');

var _isFunction2 = _interopRequireDefault(_isFunction);

var _createAction = require('./createAction');

var _createAction2 = _interopRequireDefault(_createAction);

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function createActions(actionsMap) {
  for (var _len = arguments.length, identityActions = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    identityActions[_key - 1] = arguments[_key];
  }

  (0, _invariant2.default)(identityActions.every(_isString2.default) && ((0, _isString2.default)(actionsMap) || (0, _isPlainObject2.default)(actionsMap)), 'Expected optional object followed by string action types');
  if ((0, _isString2.default)(actionsMap)) {
    return fromIdentityActions([actionsMap].concat(identityActions));
  }
  return _extends({}, fromActionsMap(actionsMap), fromIdentityActions(identityActions));
}

function isValidActionsMapValue(actionsMapValue) {
  if ((0, _isFunction2.default)(actionsMapValue)) {
    return true;
  } else if ((0, _isArray2.default)(actionsMapValue)) {
    var _actionsMapValue = _slicedToArray(actionsMapValue, 2),
        _actionsMapValue$ = _actionsMapValue[0],
        payload = _actionsMapValue$ === undefined ? _identity2.default : _actionsMapValue$,
        meta = _actionsMapValue[1];

    return (0, _isFunction2.default)(payload) && (0, _isFunction2.default)(meta);
  }
  return false;
}

function fromActionsMap(actionsMap) {
  return (0, _reduce2.default)(actionsMap, function (actionCreatorsMap, actionsMapValue, type) {
    (0, _invariant2.default)(isValidActionsMapValue(actionsMapValue), 'Expected function, undefined, or array with payload and meta ' + ('functions for ' + type));
    var actionCreator = (0, _isArray2.default)(actionsMapValue) ? _createAction2.default.apply(undefined, [type].concat(_toConsumableArray(actionsMapValue))) : (0, _createAction2.default)(type, actionsMapValue);

    return _extends({}, actionCreatorsMap, _defineProperty({}, (0, _camelCase2.default)(type), actionCreator));
  }, {});
}

function fromIdentityActions(identityActions) {
  return fromActionsMap(identityActions.reduce(function (actionsMap, actionType) {
    return _extends({}, actionsMap, _defineProperty({}, actionType, _identity2.default));
  }, {}));
}