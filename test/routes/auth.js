/* global describe:true, it:true, before:true, after:true beforeEach:true, afterEach:true */

const request = require('supertest')
const models = require('../../models')

describe('auth routes', () => {
  let app = null

  before(done => {
    models.sequelize.sync().then(() => { done() })
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

  describe('register', () => {
    it('should fail to register user without username', done => {
      request(app)
        .post('/register')
        .send({
          password: '1234',
          email: 'user1@exmaple.com'
        })
        .expect('Content-Type', /json/)
        .expect(422, done)
    })

    it('should fail to register user without password', done => {
      request(app)
        .post('/register')
        .send({
          username: 'user1',
          email: 'user1@exmaple.com'
        })
        .expect('Content-Type', /json/)
        .expect(422, done)
    })

    it('should fail to register user without email', done => {
      request(app)
        .post('/register')
        .send({
          username: 'user1',
          password: '1234'
        })
        .expect('Content-Type', /json/)
        .expect(422, done)
    })

    it('should respond with 201 when registering user', done => {
      const expected = {
        username: 'user1',
        password: '1234',
        email: 'user1@example.com'
      }

      request(app)
        .post('/register')
        .send(expected)
        .expect('Content-Type', /json/)
        .expect(201, done)
    })
  })
})
