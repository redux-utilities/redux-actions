import isUndefined from 'lodash/isUndefined';

export default function assertDefaultState(defaultState, actionTypes) {
  if (isUndefined(defaultState)) {
    throw new Error(`Expected defaultState for reducer handling ${actionTypes.join(', ')} to be defined`)
  }
}
