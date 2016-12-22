/* global describe:true, it:true, before:true, after:true beforeEach:true, afterEach:true */

const request = require('supertest')
const { expect } = require('chai')
const models = require('../../models')

describe('auth routes', () => {
  let app = null

  before(done => {
    models.sequelize.sync()
      .then(() => { done() })
  })

  after(done => {
    models.sequelize.drop().then(() => { done() })
  })

  beforeEach(() => {
    app = require('../../app')()
  })

  afterEach(done => {
    app.close(done)
    app = null
  })

  describe('/register', () => {
    it('should not respond to GET requests', done => {
      request(app)
        .get('/register')
        .expect(404, done)
    })

    it('should not respond to PUT requests', done => {
      request(app)
        .put('/register')
        .send({})
        .expect(404, done)
    })

    it('should not respond to DELETE requests', done => {
      request(app)
        .delete('/register')
        .expect(404, done)
    })

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

  describe('/login', () => {
    it('should not respond to GET requests', done => {
      request(app)
        .get('/register')
        .expect(404, done)
    })

    it('should not respond to PUT requests', done => {
      request(app)
        .put('/register')
        .send({})
        .expect(404, done)
    })

    it('should not respond to DELETE requests', done => {
      request(app)
        .delete('/register')
        .expect(404, done)
    })

    it('should respond with 400 when user does not exist', done => {
      request(app)
        .post('/login')
        .send({ username: 'admin3', passoword: '1234' })
        .expect('Content-Type', /json/)
        .expect(400, done)
    })

    it('should respond with 401 when passwords don\'t match', done => {
      request(app)
        .post('/login')
        .send({ username: 'user1', password: '4321' })
        .expect('Content-Type', /json/)
        .expect(401, done)
    })

    it('should respond with 200 and token when credentials are correct', done => {
      request(app)
        .post('/login')
        .send({ username: 'user1', password: '1234' })
        .expect('Content-Type', /json/)
        .expect(({ body }) => {
          expect(body.success).to.be.ok
          expect(body.token).to.be.a('string')
          expect(body.user).to.be.an('object')
          expect(body.user).to.have.keys([
            'createdAt',
            'email',
            'id',
            'imageAvatar',
            'username',
            'updatedAt'
          ])
        })
        .expect(200, done)
    })
  })
})
