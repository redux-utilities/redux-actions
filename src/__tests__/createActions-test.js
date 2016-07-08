import { createActions } from '../';
import { isFSA } from 'flux-standard-action';

describe('createActions', () => {
  describe('createActions(actionMap)', () => {
    it('returns an object with actions for each key', () => {
      const a = createActions({
        one: (b, c) => ({ bat: b, cat: c }),
        two: {
          payload: (d, e) => ({ dog: d, egg: e }),
          meta: (/* d, e */) => ({ zed: 1 })
        },
        three: {
          meta: (/* f */) => ({ zed: 2 })
        }
      });
      expect(a).to.be.instanceOf(Object);
      const a1 = a.one(1, 2);
      expect(a1).to.eql({ type: 'one', payload: { bat: 1, cat: 2 } });
      expect(isFSA(a1)).to.be.true;
      expect(a.one.toString()).to.equal('one');
      const a2 = a.two(3, 4);
      expect(a2).to.eql({
        type: 'two',
        payload: { dog: 3, egg: 4 },
        meta: { zed: 1 }
      });
      expect(isFSA(a2)).to.be.true;
      expect(a.two.toString()).to.equal('two');
      const a3 = a.three('foo');
      expect(a3).to.eql({
        type: 'three',
        payload: 'foo',
        meta: { zed: 2 }
      });
      expect(isFSA(a3)).to.be.true;
      expect(a.three.toString()).to.equal('three');
    });
  });

  describe('createActions(actionMap, arrDefTypes)', () => {
    it('returns an object with actions and default actions', () => {
      const a = createActions(
        {
          one: (b, c) => ({ bat: b, cat: c }),
          two: {
            payload: (d, e) => ({ dog: d, egg: e }),
            meta: (/* d, e */) => ({ zed: 1 })
          },
          three: {
            meta: (/* f */) => ({ zed: 2 })
          }
        }, [
          'four',
          'five'
        ]
      );
      expect(a).to.be.instanceOf(Object);
      const a1 = a.one(1, 2);
      expect(a1).to.eql({ type: 'one', payload: { bat: 1, cat: 2 } });
      expect(isFSA(a1)).to.be.true;
      expect(a.one.toString()).to.equal('one');
      const a2 = a.two(3, 4);
      expect(a2).to.eql({
        type: 'two',
        payload: { dog: 3, egg: 4 },
        meta: { zed: 1 }
      });
      expect(isFSA(a2)).to.be.true;
      expect(a.two.toString()).to.equal('two');
      const a3 = a.three('foo');
      expect(a3).to.eql({
        type: 'three',
        payload: 'foo',
        meta: { zed: 2 }
      });
      expect(isFSA(a3)).to.be.true;
      expect(a.three.toString()).to.equal('three');
      const a4 = a.four(44);
      expect(a4).to.eql({ type: 'four', payload: 44 });
      expect(isFSA(a4)).to.be.true;
      expect(a.four.toString()).to.equal('four');
      const a5 = a.five(55);
      expect(a5).to.eql({ type: 'five', payload: 55 });
      expect(isFSA(a5)).to.be.true;
      expect(a.five.toString()).to.equal('five');
    });
  });

  describe('createActions(actionMap, optionMap)', () => {
    it('returns an object with actions prefixed for each key', () => {
      const a = createActions(
        {
          one: (b, c) => ({ bat: b, cat: c }),
          two: {
            payload: (d, e) => ({ dog: d, egg: e }),
            meta: (/* d, e */) => ({ zed: 1 })
          },
          three: {
            meta: (/* f */) => ({ zed: 2 })
          }
        },
        {
          prefix: 'ns/'
        }
      );
      expect(a).to.be.instanceOf(Object);
      const a1 = a.one(1, 2);
      expect(a1).to.eql({ type: 'ns/one', payload: { bat: 1, cat: 2 } });
      expect(isFSA(a1)).to.be.true;
      expect(a.one.toString()).to.equal('ns/one');
      const a2 = a.two(3, 4);
      expect(a2).to.eql({
        type: 'ns/two',
        payload: { dog: 3, egg: 4 },
        meta: { zed: 1 }
      });
      expect(isFSA(a2)).to.be.true;
      expect(a.two.toString()).to.equal('ns/two');
      const a3 = a.three('foo');
      expect(a3).to.eql({
        type: 'ns/three',
        payload: 'foo',
        meta: { zed: 2 }
      });
      expect(isFSA(a3)).to.be.true;
      expect(a.three.toString()).to.equal('ns/three');
    });
  });

  describe('createActions(arrDefTypes)', () => {
    it('returns an object with default actions for each key', () => {
      const a = createActions(['one', 'two']);
      expect(a).to.be.instanceOf(Object);
      const a1 = a.one({ foo: 'bar' });
      expect(a1).to.eql({ type: 'one', payload: { foo: 'bar' } });
      expect(isFSA(a1)).to.be.true;
      expect(a.one.toString()).to.equal('one');
      const a2 = a.two(42);
      expect(a2).to.eql({ type: 'two', payload: 42 });
      expect(isFSA(a2)).to.be.true;
      expect(a.two.toString()).to.equal('two');
    });
  });

  describe('createActions(arrDefTypes, optionMap)', () => {
    it('returns an object w/default actions and prefixed type for each key ', () => {
      const a = createActions(['one', 'two'], { prefix: 'ns/' });
      expect(a).to.be.instanceOf(Object);
      const a1 = a.one({ foo: 'bar' });
      expect(a1).to.eql({ type: 'ns/one', payload: { foo: 'bar' } });
      expect(isFSA(a1)).to.be.true;
      expect(a.one.toString()).to.equal('ns/one');
      const a2 = a.two(42);
      expect(a2).to.eql({ type: 'ns/two', payload: 42 });
      expect(isFSA(a2)).to.be.true;
      expect(a.two.toString()).to.equal('ns/two');
    });
  });

  describe('createActions(actionMap, arrDefTypes, optionMap)', () => {
    it('returns an object w/actions and default actions w/prefixed types', () => {
      const a = createActions(
        {
          one: (b, c) => ({ bat: b, cat: c }),
          two: {
            payload: (d, e) => ({ dog: d, egg: e }),
            meta: (/* d, e */) => ({ zed: 1 })
          },
          three: {
            meta: (/* f */) => ({ zed: 2 })
          }
        }, [
          'four',
          'five'
        ], {
          prefix: 'ns/'
        }
      );
      expect(a).to.be.instanceOf(Object);
      const a1 = a.one(1, 2);
      expect(a1).to.eql({ type: 'ns/one', payload: { bat: 1, cat: 2 } });
      expect(isFSA(a1)).to.be.true;
      expect(a.one.toString()).to.equal('ns/one');
      const a2 = a.two(3, 4);
      expect(a2).to.eql({
        type: 'ns/two',
        payload: { dog: 3, egg: 4 },
        meta: { zed: 1 }
      });
      expect(isFSA(a2)).to.be.true;
      expect(a.two.toString()).to.equal('ns/two');
      const a3 = a.three('foo');
      expect(a3).to.eql({
        type: 'ns/three',
        payload: 'foo',
        meta: { zed: 2 }
      });
      expect(isFSA(a3)).to.be.true;
      expect(a.three.toString()).to.equal('ns/three');
      const a4 = a.four(44);
      expect(a4).to.eql({ type: 'ns/four', payload: 44 });
      expect(isFSA(a4)).to.be.true;
      expect(a.four.toString()).to.equal('ns/four');
      const a5 = a.five(55);
      expect(a5).to.eql({ type: 'ns/five', payload: 55 });
      expect(isFSA(a5)).to.be.true;
      expect(a.five.toString()).to.equal('ns/five');
    });
  });

});
