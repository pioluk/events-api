const express = require('express')
const bodyParser = require('body-parser')
const logger = require('morgan')
// const helmet = require('helmet')
// const cors = require('cors')
const models = require('./models')
const routes = require('./routes')

const DEFAULT_PORT = 3000
const port = process.env.PORT || DEFAULT_PORT

module.exports = function createApp () {
  const app = express()

  app.disable('etag')
  app.disable('views')

  app.use(bodyParser.json())
  if (process.env.NODE_ENV === 'development') {
    app.use(logger('dev'))
  }
  // app.use(helmet())

  app.use((req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*')
    next()
  })

  // app.options('*', cors())

  app.use(routes)

  app.use((req, res, next) => {
    const err = new Error('Not Found')
    err.status = 404
    next(err)
  })

  app.use((err, req, res, next) => {
    if (err.name === 'SequelizeValidationError') {
      err.status = 422
    }

    const error = (app.get('env') === 'development') ? Object.assign({}, err) : {}
    error.message = err.message
    res.status(err.status || 500)
    res.json({ success: false, error })
  })

  models.sequelize.sync()

  return app.listen(port)
}
