const camelCase = (str) =>
  str.replace(/[-_]([a-z])/g, (m) => m[1].toUpperCase());

const namespacer = '/';

export default (type) =>
  type.indexOf(namespacer) === -1
    ? camelCase(type)
    : type.split(namespacer).map(camelCase).join(namespacer);
