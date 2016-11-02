const express = require('express')
const multer = require('multer')
const auth = require('./auth')
const events = require('./events')

const upload = multer()

const router = express.Router()

router.post('/register', auth.register)
router.post('/login', auth.login)

router.get('/event', events.getAll)
router.get('/event/:id', events.get)

router.post('/event', upload.any(), events.create)

module.exports = router
