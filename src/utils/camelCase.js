import camelCase from 'lodash.camelcase';

const namespacer = '/';

export default type =>
  type.indexOf(namespacer) === -1
    ? camelCase(type)
    : type
        .split(namespacer)
        .map(part => camelCase(part))
        .join(namespacer);
