module.exports = {
  development: {
    username: 'api',
    password: process.env.DB_PASSWORD,
    database: 'project',
    host: 'final-project.c1m39k9bh7wp.eu-central-1.rds.amazonaws.com',
    dialect: 'postgres'
  },
  test: {
    dialect: 'sqlite',
    logging: null,
    storage: ':memory:'
  }
}
