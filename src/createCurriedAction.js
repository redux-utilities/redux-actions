import { curry } from 'ramda';
import createAction from './createAction';

export default (type, payloadCreator) =>
  curry(createAction(type, payloadCreator), payloadCreator.length);
