import isFunction from './isFunction';

// Map of action statuses to handler property names
const statusMappings = {
  'error': 'error',
  'success': 'next'
};

// Default action status, if none is specified
const defaultStatus = 'success';

export default function handleAction(type, handlers) {
  return (state, action) => {
    // If action type does not match, return previous state
    if (action.type !== type) return state;

    // If function is passed instead of map, use as handler
    if (isFunction(handlers)) return handlers(state, action);

    // If status is undefined, use default status
    const status = typeof action.status !== 'undefined'
      ? action.status
      : defaultStatus;

    // Get handler key that corresponds to status
    const handlerKey = statusMappings[status];

    // If status does not corresponds to a handler key, return previous state
    if (!handlerKey) return state;

    // Call handler
    // Throws if handler is not a function
    const handler = handlers[handlerKey];
    return handler(state, action);
  };
}
