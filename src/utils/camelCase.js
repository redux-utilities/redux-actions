import camelCase from 'camelcase';

const namespacer = '/';

export default type =>
  type.indexOf(namespacer) === -1
    ? camelCase(type)
    : type
        .split(namespacer)
        .map(camelCase)
        .join(namespacer);
