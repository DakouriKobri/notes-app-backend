// Local Files
const logger = require('../utils/logger');

function requestLogger(request, response, next) {
  logger.info('Method:', request.method);
  logger.info('Path:', request.path);
  logger.info('Body:', request.body);
  logger.info('---');
  next();
}

function unknownEndpoint(request, response) {
  response.status(404).send({ error: 'Unknown endpoint' });
}

function errorHandler(error, request, response, next) {
  logger.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'Malformed id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message });
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).send({ error: error.message });
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).send({ error: 'Token expired' });
  }

  next(error);
}

module.exports = {
  errorHandler,
  requestLogger,
  unknownEndpoint,
};
