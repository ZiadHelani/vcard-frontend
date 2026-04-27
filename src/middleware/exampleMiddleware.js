export default function exampleMiddleware({ next }) {
  console.log('middleware')
  return next()
}
