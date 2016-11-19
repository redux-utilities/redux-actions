const actionTypeWordPattern = /[^a-zA-Z0-9\/]/;

export default function camelCase(actionType) {
  return actionType
    .split(actionTypeWordPattern)
    .reduce((camelCased, word, index) =>
      camelCased + (index === 0
        ? word.toLowerCase()
        : word.charAt(0).toUpperCase() + word.substring(1).toLowerCase())
    , '');
}
