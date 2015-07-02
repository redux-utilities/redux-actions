import isFunction from './isFunction';

// Map of action statuses to reducer property names
const statusMappings = {
  'error': 'error',
  'success': 'success'
};

// Default action status, if none is specified
const defaultStatus = 'success';

export default function handleAction(type, reducers) {
  return (state, action) => {
    // If action type does not match, return previous state
    if (action.type !== type) return state;

    // If status is undefined, use default status
    const status = typeof action.status !== 'undefined'
      ? action.status
      : defaultStatus;

    // Get reducer key that corresponds to status
    const handlerKey = statusMappings[status];

    // If status does not correspond to a reducer key, return previous state
    if (!handlerKey) return state;

    // If function is passed instead of map, use as reducer
    if (isFunction(reducers)) return reducers(state, action);

    // Call reducer
    // Throws if reducer is not a function
    const reducer = reducers[handlerKey];
    return reducer(state, action);
  };
}
