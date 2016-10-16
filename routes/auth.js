const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { User } = require('../models')

exports.register = (req, res, next) => {
  const { username, password, email } = req.body
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      return next(err)
    }

    User.create({ username, password: hash, email })
      .then(dbUser => {
        const user = Object.assign(dbUser, { password: undefined })
        res.status(201)
        res.json({ user })
      })
      .catch(err => next(err))
  })
}

exports.login = (req, res, next) => {
  const { username, password } = req.body

  User.findOne({ where: { username } })
    .then(user => {
      if (!user) {
        const error = new Error('User does not exist.')
        error.status = 400
        return next(error)
      }

      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          return next(err)
        }

        if (!result) {
          const error = new Error('Username or password does not match.')
          error.status = 401
          return next(error)
        }

        const rawUser = Object.assign({}, user.toJSON(), { password: undefined })
        const token = jwt.sign(rawUser, process.env.SECRET, { expiresIn: '1d' })

        res.json({
          success: true,
          token,
          user: rawUser
        })
      })
    })
    .catch(err => next(err))
}

exports.authenticate = (req, res, next) => {
  if (typeof req.headers.authorization !== 'string' || !req.headers.authorization.trim()) {
    const error = new Error('Authentication token required.')
    error.status = 403
    return next(error)
  }

  const [_, token] = req.headers.authorization.split(' ') // eslint-disable-line no-unused-vars

  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) {
      const error = new Error('Invalid token.')
      error.status = 403
      return next(error)
    }

    next()
  })
}
