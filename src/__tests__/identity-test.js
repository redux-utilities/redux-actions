import identity from '../identity';

describe('identity()', () => {
  it('returns the input', () => {
    const input = {};
    expect(identity(input)).to.equal(input);
  });
});
