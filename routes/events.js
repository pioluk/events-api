const models = require('../models')
const upload = require('./upload')

const { sequelize, Event } = models

exports.getAll = (req, res, next) => {
  Event.findAll()
    .then(events => {
      res.json(events)
    })
    .catch(err => next(err))
}

exports.get = (req, res, next) => {
  const id = +req.params.id

  if (typeof id !== 'number' || Object.is(id, NaN)) {
    const error = new Error('Event id should be an integer')
    error.status = 400
    throw error
  }

  Event.findById(id)
    .then(event => {
      if (event === null) {
        const error = new Error(`Event with id ${id} could not be found`)
        error.status = 404
        throw error
      }

      res.json(event)
    })
    .catch(err => next(err))
}

exports.create = (req, res, next) => {
  const body = req.body

  sequelize.transaction(t =>
    Event.create(body, { transaction: t })
      .then(() => req.files && req.files.length > 0 ? upload(req.files[0]) : Promise.resolve())
  )
  .then(() => {
    res.status(201)
    res.json(body)
  })
  .catch(err => next(err))
}
