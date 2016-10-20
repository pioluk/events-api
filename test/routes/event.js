/* global describe:true, before:true, after:true, beforeEach:true, afterEach:true, it:true */

const request = require('supertest')
const { expect } = require('chai')
const models = require('../../models')
const { Event, User } = models

describe('event routes', () => {
  let app = null

  before(done => {
    models.sequelize.sync()
      .then(() => { done() })
  })

  after(done => {
    models.sequelize.drop().then(() => { done() })
  })

  beforeEach(() => {
    app = require('../../app.js')()
  })

  afterEach(done => {
    app.close(done)
    app = null
  })

  describe('GET /event', () => {
    it('should respond with empty array on initial GET', done => {
      request(app)
        .get('/event')
        .expect('Content-Type', /json/)
        .expect(({ body }) => {
          expect(body).to.be.an('array')
          expect(body).to.be.empty
        })
        .expect(200, done)
    })

    it('should respond with events after adding them to database', done => {
      User.create({ username: 'user1', password: 'pass', email: 'user1@example.com' })
        .then(() => Event.bulkCreate([
          {
            UserId: 1,
            title: 'Title #1',
            description: 'Description #1',
            dateStart: new Date('2016-01-01T12:00'),
            dateEnd: new Date('2016-01-01T13:00'),
            placeId: null,
            color: 'ffffff',
            imageThumbnail: null,
            imageSmall: null,
            imageBig: null
          },
          {
            UserId: 1,
            title: 'Title #2',
            description: 'Description #2',
            dateStart: new Date('2016-01-01T12:00'),
            dateEnd: new Date('2016-01-01T13:00'),
            placeId: null,
            color: 'ffffff',
            imageThumbnail: null,
            imageSmall: null,
            imageBig: null
          }
        ]))
        .then(() => {
          request(app)
            .get('/event')
            .expect('Content-Type', /json/)
            .expect(({ body }) => {
              expect(body).to.be.an('array')
              expect(body).to.have.length(2)
              expect(body[0].title).to.equal('Title #1')
              expect(body[1].title).to.equal('Title #2')
            })
            .expect(200, done)
        })
        .catch(err => done(err))
    })
  })

  describe('GET /event/:id', () => {
    before(done => {
      Event.truncate().then(() => { done() })
    })

    it('should respond with 400 if the id is not an integer', done => {
      request(app)
        .get('/event/asdf')
        .expect('Content-Type', /json/)
        .expect(400, done)
    })

    it('should respond with 404 if the requested event does not exist', done => {
      request(app)
        .get('/event/1')
        .expect('Content-Type', /json/)
        .expect(404, done)
    })
  })

  describe('POST /event', () => {
    it('should return an event if it exists', done => {
      const expectedEvent = {
        UserId: 1,
        title: 'Title #1',
        description: 'Description #1',
        dateStart: '2016-01-01T12:00:00.000Z',
        dateEnd: '2016-01-01T13:00:00.000Z',
        placeId: null,
        color: 'ffffff',
        imageThumbnail: null,
        imageSmall: null,
        imageBig: null
      }

      Event.create(expectedEvent)
        .then(res => {
          request(app)
            .get('/event/' + res.dataValues.id)
            .expect('Content-Type', /json/)
            .expect(({ body: actualEvent }) => {
              /* delete id and timestamps, as they are variable */
              delete actualEvent.id
              delete actualEvent.createdAt
              delete actualEvent.updatedAt
              delete actualEvent.deletedAt

              expect(actualEvent).to.deep.equal(expectedEvent)
            })
            .expect(200, done)
        })
    })
  })
})