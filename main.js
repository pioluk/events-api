const models = require('./models')
const createApp = require('./app')

models.sequelize.sync()
  .then(() => { createApp() })
  .catch(err => console.error(err))
