import justCamelCase from 'just-camel-case';

const camelCase = string => justCamelCase(string, { strict: true });

const namespacer = '/';

export default type =>
  type.indexOf(namespacer) === -1
    ? camelCase(type)
    : type
        .split(namespacer)
        .map(part => camelCase(part))
        .join(namespacer);
