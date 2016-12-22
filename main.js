const models = require('./models')
const createApp = require('./app')

const DEFAULT_PORT = 3000
const port = process.env.PORT || DEFAULT_PORT

models.sequelize.sync()
  .then(() => {
    const app = createApp()
    app.listen(port, () => {
      console.log('App listening on port', port)
    })
  })
  .catch(err => console.error(err))
