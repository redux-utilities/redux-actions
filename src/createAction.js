export default function createAction(type, actionCreator) {
  return (...args) => ({
    type,
    body: actionCreator(...args)
  });
}
