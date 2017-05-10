'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createAction;

var _identity = require('lodash/identity');

var _identity2 = _interopRequireDefault(_identity);

var _isFunction = require('lodash/isFunction');

var _isFunction2 = _interopRequireDefault(_isFunction);

var _isUndefined = require('lodash/isUndefined');

var _isUndefined2 = _interopRequireDefault(_isUndefined);

var _isNull = require('lodash/isNull');

var _isNull2 = _interopRequireDefault(_isNull);

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createAction(type) {
  var payloadCreator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _identity2.default;
  var metaCreator = arguments[2];

  (0, _invariant2.default)((0, _isFunction2.default)(payloadCreator) || (0, _isNull2.default)(payloadCreator), 'Expected payloadCreator to be a function, undefined or null');

  var finalPayloadCreator = (0, _isNull2.default)(payloadCreator) ? _identity2.default : payloadCreator;

  var actionCreator = function actionCreator() {
    var hasError = (arguments.length <= 0 ? undefined : arguments[0]) instanceof Error;

    var action = {
      type: type
    };

    var payload = hasError ? arguments.length <= 0 ? undefined : arguments[0] : finalPayloadCreator.apply(undefined, arguments);
    if (!(0, _isUndefined2.default)(payload)) {
      action.payload = payload;
    }

    if (hasError || payload instanceof Error) {
      // Handle FSA errors where the payload is an Error object. Set error.
      action.error = true;
    }

    if ((0, _isFunction2.default)(metaCreator)) {
      action.meta = metaCreator.apply(undefined, arguments);
    }

    return action;
  };

  actionCreator.toString = function () {
    return type.toString();
  };

  return actionCreator;
}