import { createAction } from '../';
import isPlainObject from 'lodash.isplainobject';

describe('createAction()', () => {
  describe('resulting action creator', () => {
    const type = 'TYPE';
    const actionCreator = createAction(type, b => b);
    const payload = { foo: 'bar' };
    const action = actionCreator(payload);

    it('returns plain object', () => {
      expect(isPlainObject(action)).to.be.true;
    });

    it('uses return value as body', () => {
      expect(action.body).to.equal(payload);
    });

    it('has `status` nor any extraneous keys', () => {
      expect(action).to.deep.equal({
        type,
        body: payload
      });
    });

    it('uses identity function if actionCreator is not a function', () => {
      expect(createAction(type)(payload)).to.deep.equal({
        type,
        body: payload
      });
    });
  });
});
