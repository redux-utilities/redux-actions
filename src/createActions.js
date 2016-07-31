import identity from 'lodash/identity'
import camelCase from 'lodash/camelCase'
import isPlainObject from 'lodash/isPlainObject'
import reduce from 'lodash/reduce'
import isString from 'lodash/isString'
import isFunction from 'lodash/isFunction'
import createAction  from './createAction'

function fromActionsMap(actionsMap) {
  return reduce(actionsMap, (actionCreatorsMap, payloadCreator = identity, type) => {
    if (!isFunction(payloadCreator)) {
      throw new TypeError(`Expected function or undefined payload creator for ${type}`)
    }
    return { ...actionCreatorsMap, [camelCase(type)]: createAction(type, payloadCreator) }
  }, {})
}

function fromTypes(...types) {
  return fromActionsMap(
    types.reduce((actionsMap, action) => ({ ...actionsMap, [action]: undefined }), {})
  )
}

export default function createActions(actionsMap, ...types) {
  if (types.every(isString)) {
    if (isString(actionsMap)) {
      return fromTypes(actionsMap, ...types)
    } else if (isPlainObject(actionsMap)) {
      return { ...fromActionsMap(actionsMap), ...fromTypes(...types) }
    }
  }
  throw new TypeError('Expected (optional) object followed by string action types')
}
