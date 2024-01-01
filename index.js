// NPM Packages
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Local Files
const Note = require('./models/note');

const app = express();

function requestLogger(request, response, next) {
  console.log('Method:', request.method);
  console.log('Path:', request.path);
  console.log('Body:', request.body);
  next();
}

function unknownEndpoint(request, response) {
  response.status(404).send({ error: 'Unknown endpoint' });
}

function errorHandler(error, request, response, next) {
  console.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformed id' });
  }

  next(error);
}

app.use(cors());
app.use(express.static('dist'));
app.use(express.json());
app.use(requestLogger);

app.get('/api/notes', (request, response) => {
  Note.find({}).then((notes) => {
    response.json(notes);
  });
});

app.get('/api/notes/:id', (request, response, next) => {
  const id = request.params.id;

  Note.findById(id)
    .then((note) => {
      if (note) {
        response.json(note);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.delete('/api/notes/:id', (request, response, next) => {
  const id = request.params.id;

  Note.findByIdAndDelete(id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.post('/api/notes', (request, response) => {
  const body = request.body;

  if (body.content === undefined) {
    return response.status(400).json({ error: 'Content missing' });
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  });

  note.save().then((savedNote) => {
    response.json(savedNote);
  });
});

app.put('/api/notes/:id', (request, response, next) => {
  const id = request.params.id;
  const { content, important } = request.body;

  const note = {
    content,
    important,
  };

  Note.findByIdAndUpdate(id, note, { new: true })
    .then((updatedNote) => {
      response.json(updatedNote);
    })
    .catch((error) => next(error));
});

// Handler of request with unknown endpoint
app.use(unknownEndpoint);

// Handler of request with result to errors
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
