const jwt = require('jsonwebtoken')

const isNonEmptyString = str => str !== ''
exports.isNonEmptyString = isNonEmptyString

const prop = (p, obj) => obj[p]
exports.prop = prop

const parseArray = str => str.split(',').filter(isNonEmptyString)
exports.parseArray = parseArray

const retrieveArrayFromFormData = p => data => {
  try {
    const items = prop(p, data)
    return parseArray(items)
  } catch (err) {
    return []
  }
}
exports.retrieveArrayFromFormData = retrieveArrayFromFormData

const retrieveEmails = retrieveArrayFromFormData('emails')
exports.retrieveEmails = retrieveEmails

const retrievePhones = retrieveArrayFromFormData('phones')
exports.retrievePhones = retrievePhones

const retrieveWebsites = retrieveArrayFromFormData('websites')
exports.retrieveWebsites = retrieveWebsites

const requireAuthentication = handler => (req, res, next) => {
  if (typeof req.headers.authorization !== 'string' || !req.headers.authorization.trim()) {
    const error = new Error('You need to logged in to do that.')
    error.status = 401
    return next(error)
  }

  const [_, token] = req.headers.authorization.split(' ') // eslint-disable-line no-unused-vars

  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) {
      const error = new Error('Invalid credentials')
      error.status = 403
      return next(error)
    }

    req.user = decoded
    handler(req, res, next)
  })
}
exports.requireAuthentication = requireAuthentication
