// export const notFound = (req, res, next) => {
//   const error = new Error(`Not Found this - ${req.originalUrl}`)
//   res.status(404)
//   res.json({
//     message: error.message,
//   })
//   next()
// }
export const errorHandler = (err, req, res, next) => {
  console.log('error', err.stack)
  console.log('error', err)
  next()
}
