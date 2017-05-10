'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = handleAction;

var _isFunction = require('lodash/isFunction');

var _isFunction2 = _interopRequireDefault(_isFunction);

var _isPlainObject = require('lodash/isPlainObject');

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

var _identity = require('lodash/identity');

var _identity2 = _interopRequireDefault(_identity);

var _isNil = require('lodash/isNil');

var _isNil2 = _interopRequireDefault(_isNil);

var _isUndefined = require('lodash/isUndefined');

var _isUndefined2 = _interopRequireDefault(_isUndefined);

var _includes = require('lodash/includes');

var _includes2 = _interopRequireDefault(_includes);

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _combineActions = require('./combineActions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function handleAction(actionType) {
  var reducer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _identity2.default;
  var defaultState = arguments[2];

  var actionTypes = actionType.toString().split(_combineActions.ACTION_TYPE_DELIMITER);
  (0, _invariant2.default)(!(0, _isUndefined2.default)(defaultState), 'defaultState for reducer handling ' + actionTypes.join(', ') + ' should be defined');
  (0, _invariant2.default)((0, _isFunction2.default)(reducer) || (0, _isPlainObject2.default)(reducer), 'Expected reducer to be a function or object with next and throw reducers');

  var _ref = (0, _isFunction2.default)(reducer) ? [reducer, reducer] : [reducer.next, reducer.throw].map(function (aReducer) {
    return (0, _isNil2.default)(aReducer) ? _identity2.default : aReducer;
  }),
      _ref2 = _slicedToArray(_ref, 2),
      nextReducer = _ref2[0],
      throwReducer = _ref2[1];

  return function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultState;
    var action = arguments[1];
    var type = action.type;

    if (type && !(0, _includes2.default)(actionTypes, type.toString())) {
      return state;
    }

    return (action.error === true ? throwReducer : nextReducer)(state, action);
  };
}