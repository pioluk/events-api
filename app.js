'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const models = require('./models');

const port = process.env.PORT || 3000;

const app = express();

app.disable('etag');

app.use(bodyParser.json());
app.use(logger('dev'));
app.use(helmet());

app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  next();
});

app.options('*', cors());

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  const error = (app.get('env') === 'development') ? Object.assign({}, err) : {};
  error.message = err.message;
  res.status(err.status || 500);
  res.json({ success: false, error });
});

models.sequelize.sync()
  .then(() => {
    app.listen(port, () => { console.log(`App listening at port ${port}`) });
  });
