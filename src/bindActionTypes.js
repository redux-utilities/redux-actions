const camelize = s => s.toLowerCase()
                       .replace(/_\w/g, x => x[1].toUpperCase())

export default const bindActionsTypes = actionTypes =>
  Object.keys(actionTypes)
        .reduce((acc, type) => ({
          ...acc, [camelize(type)]: createAction(type)
        }), {})
