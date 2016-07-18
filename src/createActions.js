import createAction from './createAction';

function formatType(options, key) {
  return `${options.prefix}${key}`;
}

/**
   @param actionMap object optional - creates actions for each key,
   using the value to determine the payload and meta creators. If
   value is a fn, use it for the payloadCreator. If value is an
   object use its `payload` and `meta` keys for payload and meta
   creators.
   @param arrayDefTypes array of strings optional
   @param options object optional
   @param options.prefix - string prefix all action types with, default ''
   @returns object of actions
*/
export default function createActions(actionMap, arrDefTypes, options) {
  // adjust for optional arguments
  if (Array.isArray(actionMap)) { // actionMap not provided, shift
    options = arrDefTypes;
    arrDefTypes = actionMap;
    actionMap = {};
  }

  if (!Array.isArray(arrDefTypes)) { // arrDefTypes not provided, shift
    options = arrDefTypes;
    arrDefTypes = [];
  }

  if (!options) { options = {}; }
  if (!options.prefix) { options.prefix = ''; }

  const mappedActions = Object.keys(actionMap).reduce(
    (acc, key) => {
      const type = formatType(options, key);
      const action = actionMap[key];
      let payloadCreator = undefined;
      let metaCreator = undefined;
      if (typeof action === 'function') {
        payloadCreator = action;
      } else if (typeof action === 'object') {
        payloadCreator = action.payload;
        metaCreator = action.meta;
      }
      acc[key] = createAction(type, payloadCreator, metaCreator);
      return acc;
    }, {});

  // now combine in the default actions for arrDefTypes
  const actions = arrDefTypes.reduce(
    (acc, key) => {
      const type = formatType(options, key);
      acc[key] = createAction(type);
      return acc;
    }, mappedActions);

  return actions;
}
