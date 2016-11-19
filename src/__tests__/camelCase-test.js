import camelCase from '../camelCase';
import { expect } from 'chai';

describe('camelCase', () => {
  it('should camel case a conventional action type', () => {
    expect(camelCase('MY_ACTION')).to.equal('myAction');
  });

  it('should include special delimiters in words', () => {
    expect(camelCase('NAMESPACE/MY_ACTION')).to.equal('namespace/myAction');
  });

  it('should do nothing to an already camel-cased action type', () => {
    expect(camelCase('myAction')).to.equal('myAction');
  });
});
