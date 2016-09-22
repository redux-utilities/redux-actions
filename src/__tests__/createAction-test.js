import { expect } from 'chai';
import { createAction } from '../';
import { isFSA } from 'flux-standard-action';

describe('createAction()', () => {
  describe('resulting action creator', () => {
    const type = 'TYPE';

    it('returns a valid FSA', () => {
      const actionCreator = createAction(type, b => b);
      const foobar = { foo: 'bar' };
      const action = actionCreator(foobar);
      expect(isFSA(action)).to.be.true;
    });

    it('uses return value as payload', () => {
      const actionCreator = createAction(type, b => b);
      const foobar = { foo: 'bar' };
      const action = actionCreator(foobar);
      expect(action).to.deep.equal({
        type,
        payload: foobar
      });
    });

    it('uses identity function if payloadCreator is not a function', () => {
      const actionCreator = createAction(type);
      const foobar = { foo: 'bar' };
      const action = actionCreator(foobar);
      expect(action).to.deep.equal({
        type,
        payload: foobar
      });
      expect(isFSA(action)).to.be.true;
    });

    it('accepts a second parameter for adding meta to object', () => {
      const actionCreator = createAction(type, null, ({ cid }) => ({ cid }));
      const foobar = { foo: 'bar', cid: 5 };
      const action = actionCreator(foobar);
      expect(action).to.deep.equal({
        type,
        payload: foobar,
        meta: {
          cid: 5
        }
      });
      expect(isFSA(action)).to.be.true;
    });

    it('sets error to true if payload is an Error object', () => {
      const actionCreator = createAction(type);
      const errObj = new TypeError('this is an error');

      const errAction = actionCreator(errObj);
      expect(errAction).to.deep.equal({
        type,
        payload: errObj,
        error: true
      });
      expect(isFSA(errAction)).to.be.true;

      const foobar = { foo: 'bar', cid: 5 };
      const noErrAction = actionCreator(foobar);
      expect(noErrAction).to.deep.equal({
        type,
        payload: foobar
      });
      expect(isFSA(noErrAction)).to.be.true;
    });

    it('sets error to true if payload is an Error object and meta is provided', () => {
      const actionCreator = createAction(type, null, (_, meta) => meta);
      const errObj = new TypeError('this is an error');

      const errAction = actionCreator(errObj, { foo: 'bar' });
      expect(errAction).to.deep.equal({
        type,
        payload: errObj,
        error: true,
        meta: { foo: 'bar' }
      });
    });

    it('sets payload only when defined', () => {
      const action = createAction(type)();
      expect(action).to.deep.equal({
        type
      });

      const explictUndefinedAction = createAction(type)(undefined);
      expect(explictUndefinedAction).to.deep.equal({
        type
      });

      const explictNullAction = createAction(type)(null);
      expect(explictNullAction).to.deep.equal({
        type
      });

      const baz = '1';
      const actionCreator = createAction(type, null, () => ({ bar: baz }));
      expect(actionCreator()).to.deep.equal({
        type,
        meta: {
          bar: '1'
        }
      });

      const validPayload = [false, 0, ''];
      for (let i = 0; i < validPayload.length; i++) {
        const validValue = validPayload[i];
        const expectPayload = createAction(type)(validValue);
        expect(expectPayload).to.deep.equal({
          type,
          payload: validValue
        });
      }
    });

    it('bypasses payloadCreator if payload is an Error object', () => {
      const actionCreator = createAction(type, () => 'not this', (_, meta) => meta);
      const errObj = new TypeError('this is an error');

      const errAction = actionCreator(errObj, { foo: 'bar' });
      expect(errAction).to.deep.equal({
        type,
        payload: errObj,
        error: true,
        meta: { foo: 'bar' }
      });
    });

    it('set error to true if payloadCreator return an Error object', () => {
      const errObj = new TypeError('this is an error');
      const actionCreator = createAction(type, (...args) => errObj);
      const errAction = actionCreator('invalid arguments');
      expect(errAction).to.deep.equal({
        type,
        payload: errObj,
        error: true,
      });
    });
  });
});
