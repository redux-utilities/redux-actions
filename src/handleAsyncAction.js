import { isError } from 'flux-standard-action';

function isFunction(val) {
  return typeof val === 'function';
}

export default function handleAsyncAction(type, reducers) {
  return (state, action) => {
    // If action type does not match, return previous state
    if (action.type !== type) return state;

    // If a function is passed instead of a map, assign it as
    // `next` reducer for the `end` status
    if (isFunction(reducers)) {
      reducers.end = { next: reducers };
    }

    // check if we have an async action
    const asyncState = action.meta && action.meta.async;
    let reducer;

    switch (asyncState) {
      case 'begin':
        reducer = reducers.begin;
        break;
      // the default case is used for async and normal actions a like, allowing
      // the handling of non-async actions with the same action type with the same handlers
      default:
        // using two lines here since babel throws when using a single destructuring
        // assignment including a default value. TODO: change this once it does not
        // throw anymore
        const { end = {} } = reducers; // eslint-disable-line block-scoped-var
        const { next, throw: t } = end;
        reducer = isError(action) ? t : next; // eslint-disable-line block-scoped-var
    }

    return isFunction(reducer)
      ? reducer(state, action)
      : state;
  };
}
