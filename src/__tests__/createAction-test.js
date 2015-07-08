import { createAction } from '../';
import isPlainObject from 'lodash.isplainobject';

describe('createAction()', () => {
  describe('resulting action creator', () => {
    const type = 'TYPE';
    const actionCreator = createAction(type, b => b, ({ cid }) => ({cid}));
    const foobar = { foo: 'bar', cid: 5 };
    const action = actionCreator(foobar);

    it('returns plain object', () => {
      expect(isPlainObject(action)).to.be.true;
    });

    it('uses return value as payload', () => {
      expect(action.payload).to.equal(foobar);
    });

    it('has no extraneous keys', () => {
      expect(action).to.deep.equal({
        type,
        payload: foobar,
        meta: {
          cid: 5
        }
      });
    });

    it('uses identity function if actionCreator and/or metaCreator is not a function', () => {
      expect(createAction(type)(foobar)).to.deep.equal({
        type,
        payload: foobar,
        meta: foobar
      });
    });
  });
});
