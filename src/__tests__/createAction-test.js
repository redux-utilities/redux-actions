import { createAction } from '../';
import isPlainObject from 'lodash.isplainobject';

describe('createAction()', () => {
  describe('resulting action creator', () => {
    const type = 'TYPE';
    const actionCreator = createAction(type, b => b);
    const foobar = { foo: 'bar' };
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
        payload: foobar
      });
    });

    it('uses identity function if actionCreator is not a function', () => {
      expect(createAction(type)(foobar)).to.deep.equal({
        type,
        payload: foobar
      });
    });
  });
});
