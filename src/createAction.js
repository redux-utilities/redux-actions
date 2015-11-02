/* @flow */
import identity from './identity';

export type ActionType = string;
export type Action = {
  type: ActionType;
  payload: any;
  error?: bool;
  meta?: any;
};
type ActionCreator = (...args: any) => Action;

export default function createAction(
  type: ActionType,
  actionCreator: Function,
  metaCreator?: Function
): ActionCreator {
  const finalActionCreator = typeof actionCreator === 'function'
    ? actionCreator
    : identity;

  return (...args) => {
    const action: Action = {
      type,
      payload: finalActionCreator(...args),
    };

    if (typeof metaCreator === 'function') {
      action.meta = metaCreator(...args);
    }

    return action;
  };
}
