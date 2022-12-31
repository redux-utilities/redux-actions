const hasSpace = /\s/;
const hasSeparator = /(_|-|\.|:)/;
const hasCamel = /([a-z][A-Z]|[A-Z][a-z])/;
const namespacer = '/';

const separatorSplitter = /[\W_]+(.|$)/g;

const unseparate = (string) =>
  string.replace(separatorSplitter, (_m, next) => (next ? ' ' + next : ''));

const camelSplitter = /(.)([A-Z]+)/g;

const uncamelize = (string) =>
  string.replace(
    camelSplitter,
    (_m, previous, uppers) =>
      previous + ' ' + uppers.toLowerCase().split('').join(' ')
  );

const toNoCase = (string) => {
  if (hasSpace.test(string)) return string.toLowerCase();
  if (hasSeparator.test(string))
    return (unseparate(string) || string).toLowerCase();
  if (hasCamel.test(string)) return uncamelize(string).toLowerCase();
  return string.toLowerCase();
};

const toSpaceCase = (string) =>
  toNoCase(string)
    .replace(/[\W_]+(.|$)/g, (_matches, match) => (match ? ' ' + match : ''))
    .trim();

const toCamelCase = (string) =>
  toSpaceCase(string).replace(/\s(\w)/g, (_matches, letter) =>
    letter.toUpperCase()
  );

export default (type) =>
  type.indexOf(namespacer) === -1
    ? toCamelCase(type)
    : type.split(namespacer).map(toCamelCase).join(namespacer);
