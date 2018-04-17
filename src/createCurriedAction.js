import curryN from 'lodash/fp/curryN';
import createAction from './createAction';

export default (type, payloadCreator) =>
  curryN(payloadCreator.length, createAction(type, payloadCreator));
