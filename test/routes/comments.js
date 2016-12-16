/* global describe:true, before:true, after:true, beforeEach:true, afterEach:true, it:true */

const request = require('supertest')
const { expect } = require('chai')
const models = require('../../models')
const { Event, User, Comment } = models

const createUser = (username = 'user1', password = 'pass') =>
  User.create({ username, password, email: `${username}@example.com` })

const registerUser = (app, username, password) =>
  new Promise((resolve, reject) => {
    request(app)
      .post('/register')
      .send({ username, password, email: `${username}@example.com` })
      .end((err, res) => {
        if (err) {
          return reject(err)
        }

        resolve(res.body.user)
      })
  })

describe('comment routes', () => {
  let app = null

  before(done => {
    models.sequelize.sync()
      .then(() => { done() })
  })

  after(done => {
    models.sequelize.drop().then(() => { done() })
  })

  beforeEach(() => {
    app = require('../../application')()
  })

  afterEach(done => {
    app.close(done)
    app = null
  })

  describe('GET /event/:id/comment', () => {
    afterEach(done => {
      models.sequelize.drop()
        .then(() => models.sequelize.sync())
        .then(() => done())
        .catch(err => {
          console.error(err)
          done(err)
        })
    })

    it('should respond with no comments on initial request', done => {
      createUser()
        .then(user =>
          Event.create({
            UserId: user.id,
            title: 'Title #1',
            description: 'Description #1',
            dateStart: new Date('2016-01-01T12:00'),
            dateEnd: new Date('2016-01-01T13:00'),
            PlaceId: null,
            color: 'ffffff',
            image: null
          })
        )
        .then(event => {
          request(app)
            .get(`/event/${event.id}/comment`)
            .expect('Content-Type', /json/)
            .expect(({ body }) => {
              expect(body).to.be.an('object')
              expect(body.success).to.be.true
              expect(body.count).to.equal(0)
              expect(body.comments).to.have.length(0)
            })
            .expect(200, done)
        })
        .catch(err => done(err))
    })

    it('should respond with added comments', done => {
      let event

      createUser()
        .then(user =>
          Event.create({
            UserId: user.id,
            title: 'Title #1',
            description: 'Description #1',
            dateStart: new Date('2016-01-01T12:00'),
            dateEnd: new Date('2016-01-01T13:00'),
            PlaceId: null,
            color: 'ffffff',
            image: null
          })
        )
        .then(e => {
          event = e

          return Comment.bulkCreate([
            {
              UserId: event.UserId,
              EventId: event.id,
              text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
            },
            {
              UserId: event.UserId,
              EventId: event.id,
              text: 'Donec porta luctus augue sit amet ultrices.'
            }
          ])
        })
        .then(result => {
          request(app)
            .get(`/event/${event.id}/comment`)
            .expect('Content-Type', /json/)
            .expect(({ body }) => {
              expect(body).to.be.an('object')
              expect(body.success).to.be.true
              expect(body.count).to.equal(2)
              expect(body.comments).to.have.length(2)

              const comments = body.comments
              expect(comments[0].text).to.equal('Lorem ipsum dolor sit amet, consectetur adipiscing elit.')
              expect(comments[1].text).to.equal('Donec porta luctus augue sit amet ultrices.')
            })
            .expect(200, done)
        })
        .catch(err => done(err))
    })

    it('should respond with comments belonging to only one event', done => {
      let user
      let events = []

      createUser()
        .then(u => {
          user = u

          return Event.create({
            UserId: user.id,
            title: 'Title #1',
            description: 'Description #1',
            dateStart: new Date('2016-01-01T12:00'),
            dateEnd: new Date('2016-01-01T13:00'),
            PlaceId: null,
            color: 'ffffff',
            image: null
          })
        })
        .then(e => {
          events[0] = e

          return Event.create({
            UserId: user.id,
            title: 'Title #2',
            description: 'Description #2',
            dateStart: new Date('2016-01-01T12:00'),
            dateEnd: new Date('2016-01-01T13:00'),
            PlaceId: null,
            color: 'ffffff',
            image: null
          })
        })
        .then(e => {
          events[1] = e

          return Comment.bulkCreate([
            {
              UserId: events[0].UserId,
              EventId: events[0].id,
              text: 'Comment #1'
            },
            {
              UserId: events[0].UserId,
              EventId: events[0].id,
              text: 'Comment #2'
            },
            {
              UserId: events[0].UserId,
              EventId: events[1].id,
              text: 'Comment #1'
            },
            {
              UserId: events[0].UserId,
              EventId: events[1].id,
              text: 'Comment #2'
            }
          ])
        })
        .then(comments => {
          request(app)
            .get(`/event/${events[0].id}/comment`)
            .expect('Content-Type', /json/)
            .expect(({ body }) => {
              expect(body).to.be.an('object')
              expect(body.count).to.equal(2)
              expect(body.comments).to.have.length(2)
              expect(body.success).to.be.true
              body.comments.forEach(c => expect(c.EventId).to.equal(events[0].id))
            })
            .expect(200, done)
        })
        .catch(err => {
          console.error(err)
          done(err)
        })
    })
  })

  describe('POST /event/:id/comment', () => {
    afterEach(done => {
      models.sequelize.drop()
        .then(() => models.sequelize.sync())
        .then(() => done())
        .catch(err => {
          console.error(err)
          done(err)
        })
    })

    it('should respond with when 401 when requested without credentials', done => {
      const comment = { text: 'Comment #1' }

      createUser()
        .then(user =>
          Event.create({
            UserId: user.id,
            title: 'Title #1',
            description: 'Description #1',
            dateStart: new Date('2016-01-01T12:00'),
            dateEnd: new Date('2016-01-01T13:00'),
            PlaceId: null,
            color: 'ffffff',
            image: null
          })
        )
        .then(event => {
          request(app)
            .post(`/event/${event.id}/comment`, comment)
            .expect('Content-Type', /json/)
            .expect(401, done)
        })
        .catch(err => done(err))
    })

    it('should respond with when 403 when requested with invalid credentials', done => {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwidXNlcm5hbWUiOiJwaW9sdWsxIiwiZW1haWwiOiIxODE0MjMxQGVkdS5wLmxvZHoucGwiLCJpbWFnZUF2YXRhciI6bnVsbCwiY3JlYXRlZEF0IjoiMjAxNi0xMi0wM1QxNDoxNDozOS42MThaIiwidXBkYXRlZEF0IjoiMjAxNi0xMi0wM1QxNDoxNDozOS42MThaIiwiaWF0IjoxNDgwNzc0NDk0LCJleHAiOjE0ODA4NjA4OTR9.0oNdn6Dg2alLdBZpNcv0r-iQ4QQYcoTQolNmBuHirlw'
      const comment = { text: 'Comment #1' }

      createUser()
        .then(user =>
          Event.create({
            UserId: user.id,
            title: 'Title #1',
            description: 'Description #1',
            dateStart: new Date('2016-01-01T12:00'),
            dateEnd: new Date('2016-01-01T13:00'),
            PlaceId: null,
            color: 'ffffff',
            image: null
          })
        )
        .then(event => {
          request(app)
            .post(`/event/${event.id}/comment`)
            .send(comment)
            .set('Authorization', `Bearer ${token}`)
            .expect('Content-Type', /json/)
            .expect(403, done)
        })
        .catch(err => done(err))
    })

    it.skip('should respond with when 201 when requested with valid data', done => {
      let event = null
      let token = null
      const username = 'user1'
      const password = 'pass'
      const comment = { text: 'Comment #1' }

      registerUser(app, username, password)
        .then(user =>
          Event.create({
            UserId: user.id,
            title: 'Title #1',
            description: 'Description #1',
            dateStart: new Date('2016-01-01T12:00'),
            dateEnd: new Date('2016-01-01T13:00'),
            PlaceId: null,
            color: 'ffffff',
            image: null
          })
        )
        .then(e => {
          event = e
        })
        .then(() => {
          request(app)
            .post('/login')
            .send({ username, password })
            .end((err, res) => {
              if (err) {
                return done(err)
              }

              token = res.body.token
            })
        })
        .then(() => {
          request(app)
            .post(`/event/${event.id}/comment`, comment)
            .set('Authorization', `Bearer ${token}`)
            .expect('Content-Type', /json/)
            .expect(201, done)
        })
        .catch(err => done(err))
    })
  })

  describe('DELETE /event/:id/comment/:commentId', () => {
    afterEach(done => {
      models.sequelize.drop()
        .then(() => models.sequelize.sync())
        .then(() => done())
        .catch(err => {
          console.error(err)
          done(err)
        })
    })
  })
})
