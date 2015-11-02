/* @flow */

export default function ownKeys(object: Object): Array<string> {
  // $FlowIssue Flow does not yet support ES6 `Reflect`.
  if (typeof Reflect !== 'undefined') {
    return Reflect.ownKeys(object);
  }

  let keys = Object.getOwnPropertyNames(object);

  if (typeof Object.getOwnPropertySymbols === 'function') {
    // $FlowIssue Flow does not yet support `Object.getOwnPropertySymbols`.
    keys = keys.concat(Object.getOwnPropertySymbols(object));
  }

  return keys;
}
