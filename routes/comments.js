const models = require('../models')
const Comment = models.Comment

const includeUser = [{
  model: models.User,
  attributes: ['id', 'username', 'imageAvatar']
}]

exports.getAll = (req, res, next) => {
  const eventId = +req.params.id
  const limit = +req.query.limit || 20
  const offset = +req.query.offset || 0

  if (typeof eventId !== 'number' || Object.is(eventId, NaN)) {
    const error = new Error('Event id must be an integer')
    error.status = 400
    throw error
  }

  Comment.findAndCount({ where: { EventId: eventId }, order: [['updatedAt', 'DESC']], offset, limit, include: includeUser })
    .then(results => {
      res.json({
        count: results.count,
        comments: results.rows,
        success: true
      })
    })
    .catch(err => next(err))
}

exports.get = (req, res, next) => {
  const eventId = +req.params.id
  const id = +req.params.commentId

  if (typeof eventId !== 'number' || Object.is(eventId, NaN)) {
    const error = new Error('Event id should be an integer.')
    error.status = 400
    throw error
  }

  if (typeof id !== 'number' || Object.is(id, NaN)) {
    const error = new Error('Comment id should be an integer.')
    error.status = 400
    throw error
  }

  Comment.findOne({ where: { EventId: eventId, id }, include: includeUser })
    .then(comment => {
      if (comment === null) {
        const error = new Error('Comment does not exist.')
        error.status = 404
        throw error
      }

      delete comment.User.password
      return comment
    })
    .then(comment => {
      res.json({
        comment,
        success: true
      })
    })
    .catch(err => next(err))
}

exports.create = (req, res, next) => {
  const EventId = +req.params.id

  if (typeof EventId !== 'number' || Object.is(EventId, NaN)) {
    const error = new Error('Event id should be an integer')
    error.status = 400
    throw error
  }

  const user = req.user
  const data = Object.assign({}, req.body, { EventId, UserId: user.id })

  Comment.create(data)
    .then(comment => {
      res.status(201)
      const userData = { id: user.id, username: user.username, imageAvatar: user.imageAvatar }
      res.json(Object.assign({ User: userData, removable: true }, comment.toJSON()))
    })
    .catch(err => next(err))
}

exports.delete = (req, res, next) => {
  const eventId = +req.params.id
  const commentId = +req.params.commentId

  if (typeof eventId !== 'number' || Object.is(eventId, NaN)) {
    const error = new Error('Event id should be an integer')
    error.status = 400
    throw error
  }

  if (typeof commentId !== 'number' || Object.is(commentId, NaN)) {
    const error = new Error('Comment id should be an integer')
    error.status = 400
    throw error
  }

  Comment.findOne({ where: { EventId: eventId, id: commentId } })
    .then(comment => {
      if (comment === null) {
        const error = new Error('Comment not found.')
        error.status = 404
        throw error
      }

      if (req.user.id !== comment.UserId) {
        const error = new Error('You do not have permission to delete that comment.')
        error.status = 403
        throw error
      }
    })
    .then(() => Comment.destroy({ where: { id: commentId } }))
    .then(() => {
      res.status(204).end()
    })
    .catch(err => next(err))
}
