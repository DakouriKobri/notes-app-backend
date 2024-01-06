// NPM Packages
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('express-async-errors');

// Local Files
const config = require('./utils/config');
const logger = require('./utils/logger');
const middleware = require('./utils/middleware');
const notesRouter = require('./controllers/notes');

const app = express();

mongoose.set('strictQuery', false);

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info('Connected to MongoDB');
  })
  .catch((error) => {
    logger.error('Error connecting to MongoDB:', error.message);
  });

app.use(cors());
app.use(express.static('dist'));
app.use(express.json());
app.use(middleware.requestLogger);

app.use('/api/notes', notesRouter);

// Handler of request with unknown endpoint
app.use(middleware.unknownEndpoint);

// Handler of request with result to errors
app.use(middleware.errorHandler);

module.exports = app;
