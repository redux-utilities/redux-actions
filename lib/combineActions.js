'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ACTION_TYPE_DELIMITER = undefined;
exports.default = combineActions;

var _isString = require('lodash/isString');

var _isString2 = _interopRequireDefault(_isString);

var _isFunction = require('lodash/isFunction');

var _isFunction2 = _interopRequireDefault(_isFunction);

var _isEmpty = require('lodash/isEmpty');

var _isEmpty2 = _interopRequireDefault(_isEmpty);

var _toString = require('lodash/toString');

var _toString2 = _interopRequireDefault(_toString);

var _isSymbol = require('lodash/isSymbol');

var _isSymbol2 = _interopRequireDefault(_isSymbol);

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ACTION_TYPE_DELIMITER = exports.ACTION_TYPE_DELIMITER = '||';

function isValidActionType(actionType) {
  return (0, _isString2.default)(actionType) || (0, _isFunction2.default)(actionType) || (0, _isSymbol2.default)(actionType);
}

function isValidActionTypes(actionTypes) {
  if ((0, _isEmpty2.default)(actionTypes)) {
    return false;
  }
  return actionTypes.every(isValidActionType);
}

function combineActions() {
  for (var _len = arguments.length, actionsTypes = Array(_len), _key = 0; _key < _len; _key++) {
    actionsTypes[_key] = arguments[_key];
  }

  (0, _invariant2.default)(isValidActionTypes(actionsTypes), 'Expected action types to be strings, symbols, or action creators');
  var combinedActionType = actionsTypes.map(_toString2.default).join(ACTION_TYPE_DELIMITER);
  return { toString: function toString() {
      return combinedActionType;
    } };
}