import createAction from './createAction';
import curryN from 'lodash/fp/curryN';

export default (type, payloadCreator) =>
    curryN(payloadCreator.length, createAction(type, payloadCreator));
