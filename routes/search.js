const models = require('../models')

const { sequelize, Event, Email, Phone, Website, Place } = models

module.exports = (req, res, next) => {
  const lat = +req.query.lat
  const lng = +req.query.lng
  const radius = +req.query.r
  const limit = +req.query.limit || 24
  const offset = +req.query.offset || 0

  if (typeof lat !== 'number' || Object.is(lat, NaN) ||
      typeof lng !== 'number' || Object.is(lng, NaN) ||
      typeof radius !== 'number' || Object.is(radius, NaN)) {
    const error = new Error('Coordinates should be numbers.')
    error.status = 400
    throw error
  }

  const countQuery = `
    SELECT COUNT(events.id) FROM events
      RIGHT JOIN places on events."PlaceId" = places.id
      WHERE ST_DWithin(ST_MakePoint(${lat}, ${lng})::GEOGRAPHY, places.the_geog, ${radius})
  `

  const selectQuery = `
    SELECT events.*, ST_Distance(ST_MakePoint(${lat}, ${lng})::GEOGRAPHY, places.the_geog) as distance FROM events
      RIGHT JOIN places on events."PlaceId" = places.id
      WHERE ST_DWithin(ST_MakePoint(${lat}, ${lng})::GEOGRAPHY, places.the_geog, ${radius})
      ORDER BY distance ASC, "updatedAt" DESC, "createdAt" DESC
      LIMIT ${limit} OFFSET ${offset}
  `

  const countPromise = sequelize.query(countQuery, { type: sequelize.QueryTypes.SELECT })
    .then(([result]) => +result.count)

  const eventsPromise = sequelize.query(selectQuery, { model: Event, type: sequelize.QueryTypes.SELECT })

  Promise.all([countPromise, eventsPromise])
    .then(([count, events]) => {
      res.json({
        count,
        events
      })
    })
    .catch(err => next(err))
}
