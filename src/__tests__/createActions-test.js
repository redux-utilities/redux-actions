import { createActions } from '../';
import { expect } from 'chai';

describe('createActions', () => {
  it('should throw an error when given arguments that contain a non-string', () => {
    const expectedError = 'Expected (optional) object followed by string action types';

    expect(() => createActions(1)).to.throw(TypeError, expectedError);
    expect(() => createActions({ ACTION_1: undefined }, [])).to.throw(TypeError, expectedError);
    expect(() => createActions('ACTION_1', true)).to.throw(TypeError, expectedError);
  });

  it('should throw an error when given bad payload creators', () => {
    expect(
      () => createActions({ ACTION_1: [] })
    ).to.throw(TypeError, 'Expected function or undefined payload creator for ACTION_1');

    expect(
      () => createActions({
        ACTION_1: undefined,
        ACTION_2: 'string'
      })
    ).to.throw(TypeError, 'Expected function or undefined payload creator for ACTION_2');
  });

  it('should return a map of camel-cased action types to action creators', () => {
    const { actionOne, actionTwo } = createActions({
      ACTION_ONE(key, value) {
        return { [key]: value };
      },
      ACTION_TWO(first, second) {
        return [first, second];
      }
    });

    expect(actionOne('from', 1)).to.deep.equal({
      type: 'ACTION_ONE',
      payload: { from: 1 }
    });
    expect(actionTwo('from', 2)).to.deep.equal({
      type: 'ACTION_TWO',
      payload: ['from', 2]
    });
  });

  it('should use the identity payload creator if the map reducer value is not a function', () => {
    const { action1, action2 } = createActions({
      ACTION_1: undefined,
      ACTION_2: undefined
    });

    expect(action1(1)).to.deep.equal({
      type: 'ACTION_1',
      payload: 1
    });

    expect(action2({ from: 2 })).to.deep.equal({
      type: 'ACTION_2',
      payload: { from: 2 }
    });
  });

  it('should use identity payload creators if given string action types', () => {
    const { action1, action2 } = createActions('ACTION_1', 'ACTION_2');

    expect(action1(1)).to.deep.equal({
      type: 'ACTION_1',
      payload: 1
    });

    expect(action2(2)).to.deep.equal({
      type: 'ACTION_2',
      payload: 2
    });
  });

  it('should create actions from an object and action types', () => {
    const { action1, action2, action3, action4 } = createActions({
      ACTION_1(key, value) {
        return { [key]: value };
      },
      ACTION_2(first, second) {
        return [first, second];
      }
    }, 'ACTION_3', 'ACTION_4');

    expect(action1('from', 1)).to.deep.equal({
      type: 'ACTION_1',
      payload: { from: 1 }
    });
    expect(action2('from', 2)).to.deep.equal({
      type: 'ACTION_2',
      payload: ['from', 2]
    });
    expect(action3(3)).to.deep.equal({
      type: 'ACTION_3',
      payload: 3
    });
    expect(action4(4)).to.deep.equal({
      type: 'ACTION_4',
      payload: 4
    });
  });
});
