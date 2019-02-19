const express = require('express');
const logger = require('morgan');
const app = express();
const routes = require('./routes');
const db = require('./db');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

db.init();

routes.init(app);

module.exports = app;
