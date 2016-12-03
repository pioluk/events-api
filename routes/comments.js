const models = require('../models')
const Comment = models.Comment

exports.getAll = (req, res, next) => {
  const limit = +req.query.limit || 20
  const offset = +req.query.offset || 0

  Comment.findAndCount({ order: [['updatedAt', 'DESC']], offset, limit })
    .then(results => {
      res.json({
        count: results.count,
        events: results.rows,
        success: true
      })
    })
    .catch(err => next(err))
}

exports.get = (req, res, next) => {
  const id = +req.params.commentId

  if (typeof id !== 'number' || Object.is(id, NaN)) {
    const error = new Error('Comment id should be an integer')
    error.status = 400
    throw error
  }

  Comment.findById(id)
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

  const data = Object.assign({}, req.body, { EventId, UserId: req.user.id })

  Comment.create(data)
    .then(comment => {
      res.status(201)
      res.json(comment)
    })
    .catch(err => next(err))
}

exports.delete = (req, res, next) => {
  const commentId = +req.params.commentId

  if (typeof commentId !== 'number' || Object.is(commentId, NaN)) {
    const error = new Error('Comment id should be an integer')
    error.status = 400
    throw error
  }

  Comment.findById(commentId)
    .then(comment => {
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
