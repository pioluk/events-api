const express = require('express')
const responseTime = require('response-time')
const bodyParser = require('body-parser')
const logger = require('morgan')
const helmet = require('helmet')
const cors = require('cors')
const routes = require('./routes')

const DEFAULT_PORT = 3000
const port = process.env.PORT || DEFAULT_PORT

module.exports = function createApp () {
  const app = express()

  app.disable('etag')
  app.disable('views')

  app.use(responseTime())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(bodyParser.json())
  if (process.env.NODE_ENV !== 'test') {
    app.use(logger('dev'))
  }

  if (process.env.NODE_ENV === 'production') {
    app.use(helmet())
  }

  app.use((req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*')
    next()
  })

  app.options('*', cors())

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

  return app.listen(port, () => {
    console.log('App listening on port', port)
  })
}
