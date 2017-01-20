const express = require('express')
const multer = require('multer')
const auth = require('./auth')
const events = require('./events')
const comments = require('./comments')
const search = require('./search')
const health = require('./health')
const { requireAuthentication } = require('./helpers')

const upload = multer()

const router = express.Router()

// health
router.get('/health', health)

// auth
router.post('/register', auth.register)
router.post('/login', auth.login)

// events
router.get('/event', events.getAll)
router.post('/event', upload.any(), requireAuthentication(events.create))
router.get('/event/search', search.fts)
router.get('/event/location', search.location)
router.get('/event/:id', events.get)
router.get('/event/:id/nearby', events.nearby)

// comments
router.get('/event/:id/comment', comments.getAll)
router.get('/event/:id/comment/:commentId', comments.get)
router.post('/event/:id/comment', requireAuthentication(comments.create))
router.delete('/event/:id/comment/:commentId', requireAuthentication(comments.delete))

module.exports = router
