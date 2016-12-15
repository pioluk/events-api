const { sequelize } = require('../models')

module.exports = (req, res, next) => {
  sequelize.query('SELECT now()')
    .then(() => {
      res.json({ success: true })
    })
    .catch(err => next(err))
}
