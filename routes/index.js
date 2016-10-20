const express = require('express')
const auth = require('./auth')
const events = require('./events')

const router = express.Router()

router.post('/register', auth.register)
router.post('/login', auth.login)

router.get('/event', events.getAll)
router.get('/event/:id', events.get)

router.post('/event', events.create)

module.exports = router
