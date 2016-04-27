import createAction from './createAction'

const camelize = s => s.toLowerCase()
                       .replace(/_\w/g, x => x[1].toUpperCase())

export default function createActions (actionTypes) {
  return Object.keys(actionTypes)
    .reduce((acc, type) => ({
      ...acc, [camelize(type)]: createAction(type)
    }), {})
}
