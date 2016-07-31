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
    ).to.throw(
      TypeError,
      'Expected function, plain object with payload and meta keys, or undefined for ACTION_1'
    );

    expect(
      () => createActions({
        ACTION_1: undefined,
        ACTION_2: 'string'
      })
    ).to.throw(
      TypeError,
      'Expected function, plain object with payload and meta keys, or undefined for ACTION_2'
    );
  });
  
  it('should throw an error when given a bad payload or meta creator ', () => {
    expect(
      () => createActions({
        ACTION_1: {
          payload: [],
          meta: () => {}
        }
      })
    ).to.throw(
      TypeError,
      'Expected function, plain object with payload and meta keys, or undefined for ACTION_1'
    );
    
    expect(
      () => createActions({
        ACTION_1: {
          payload: () => {},
          meta: () => {}
        },
        ACTION_2: {
          payload: () => {},
          meta: 1
        }
      })
    ).to.throw(
      TypeError,
      'Expected function, plain object with payload and meta keys, or undefined for ACTION_2'
    );
  });
  
  it('should throw an error when no meta creator is given in object form', () => {
    expect(
      () => createActions({
        ACTION_1: {
          payload: [],
        }
      })
    ).to.throw(
      TypeError,
      'Expected function, plain object with payload and meta keys, or undefined for ACTION_1'
    );
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

  it('should use the identity payload creator if the reducer value is undefined', () => {
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
  
  it('should use the identity payload creator if the payload value is undefined in object form', () => {
    const { action1, action2 } = createActions({
      ACTION_1: {
        meta(meta1) {
          return { meta1 }
        }
      },
      ACTION_2: {
        meta({ from }) {
          return { meta2: from }
        }
      },
    });
    
    expect(action1(1)).to.deep.equal({
      type: 'ACTION_1',
      payload: 1,
      meta: { meta1: 1 }
    });
    
    expect(action2({ from: 2 })).to.deep.equal({
      type: 'ACTION_2',
      payload: { from: 2 },
      meta: { meta2: 2 }
    });
  });
  
  it('should use the meta creator if the meta value is a function in object form', () => {
    const { action1, action2 } = createActions({
      ACTION_1: {
        payload(value) {
          return { value }
        },
        meta(meta1) {
          return { meta1 }
        }
      },
      ACTION_2: {
        payload({ from }) {
          return from
        },
        meta({ from }) {
          return { meta2: from }
        }
      },
    });
  
    expect(action1(1)).to.deep.equal({
      type: 'ACTION_1',
      payload: { value: 1 },
      meta: { meta1: 1 }
    });
  
    expect(action2({ from: 2 })).to.deep.equal({
      type: 'ACTION_2',
      payload: 2,
      meta: { meta2: 2 }
    });
  })

  it('should use identity payload creators for trailing string action types', () => {
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

  it('should create actions from an actions map and action types', () => {
    const { action1, action2, action3, action4 } = createActions({
      ACTION_1(key, value) {
        return { [key]: value };
      },
      ACTION_2: {
        payload(first, second) {
          return [first, second];
        },
        meta(first, second) {
          return { first, second }
        }
      }
    }, 'ACTION_3', 'ACTION_4');

    expect(action1('from', 1)).to.deep.equal({
      type: 'ACTION_1',
      payload: { from: 1 }
    });
    expect(action2('from', 2)).to.deep.equal({
      type: 'ACTION_2',
      payload: ['from', 2],
      meta: { first: 'from', second: 2 },
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
