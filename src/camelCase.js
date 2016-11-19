const actionTypeWordPattern = /[^a-zA-Z0-9\/]/;

export default function camelCase(actionType) {
  return actionType
    .split(actionTypeWordPattern)
    .reduce((camelCasedActionType, actionTypeWord, index) =>
      camelCasedActionType + (index === 0
        ? actionTypeWord.toLowerCase()
        : actionTypeWord.charAt(0).toUpperCase() + actionTypeWord.substring(1).toLowerCase())
    , '');
}
