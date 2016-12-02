const models = require('../models')
const upload = require('../upload')
const { retrieveEmails, retrievePhones, retrieveWebsites } = require('./helpers')

const { sequelize, Event, Email, Phone, Website, Place } = models

exports.getAll = (req, res, next) => {
  const limit = +req.query.limit || 20
  const offset = +req.query.offset || 0

  Event.findAndCount({ order: [['updatedAt', 'DESC']], limit, offset })
    .then(result => {
      res.json({
        count: result.count,
        events: result.rows,
        success: true
      })
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

const addEmails = (eventId, emails, t) =>
  Email.bulkCreate(
    emails.map(email => ({ EventId: eventId, address: email })),
    { validate: true, transaction: t }
  )

const addPhones = (eventId, numbers, t) =>
  Phone.bulkCreate(
    numbers.map(number => ({ EventId: eventId, number })),
    { validate: true, transaction: t }
  )

const addWebsites = (eventId, websites, t) =>
  Website.bulkCreate(
    websites.map(website => ({ EventId: eventId, address: website })),
    { validate: true, transaction: t }
  )

const createPlace = t => (name, lat, lng, placeId) =>
  Place.create({ name, lat, lng, placeId }, { transaction: t })

const createPlaceIfNotExists = t => (name, lat, lng, placeId) => {
  return Place.findOne({ where: { placeId }, transaction: t })
    .then(place => {
      if (place === null) {
        return createPlace(t)(name, lat, lng, placeId)
      } else {
        return place
      }
    })
}

const addPlaceId = (body, placeId) => Object.assign({}, body, { PlaceId: placeId })

exports.create = (req, res, next) => {
  const body = req.body

  const locationName = body['location.name']
  const locationLat = body['location.lat']
  const locationLng = body['location.lng']
  const locationPlaceId = body['location.placeId']

  const emails = retrieveEmails(body)
  const phones = retrievePhones(body)
  const websites = retrieveWebsites(body)

  let event

  sequelize.transaction(t =>
    createPlaceIfNotExists(t)(locationName, locationLat, locationLng, locationPlaceId)
      .then(place => Event.create(addPlaceId(body, place.id), { transaction: t }))
      .then(e => { event = e })
      .then(() => (emails instanceof Array && emails.length > 0) && addEmails(event.id, emails, t))
      .then(() => (phones instanceof Array && phones.length > 0) && addPhones(event.id, phones, t))
      .then(() => (websites instanceof Array && websites.length > 0) && addWebsites(event.id, websites, t))
      .then(() => req.files && req.files.length > 0 ? upload(req.files[0]) : Promise.resolve())
  )
  .then(() => {
    res.status(201)
    res.json(body)
  })
  .catch(err => next(err))
}
