const models = require('./models')
const createApp = require('./application')

models.sequelize.sync()
  .then(() => { createApp() })
  .catch(err => console.error(err))
