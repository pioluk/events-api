const { Event } = require('../models')

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
  Event.create(body)
    .then(() => {
      res.status(201)
      res.json(body)
    })
    .catch(err => next(err))
}
