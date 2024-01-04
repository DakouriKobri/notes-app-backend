// NPM Packages
const notesRouter = require('express').Router();

// Local Files
const Note = require('../models/note');

notesRouter.get('/', (request, response) => {
  Note.find({}).then((notes) => {
    response.json(notes);
  });
});

notesRouter.get('/:id', (request, response, next) => {
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

notesRouter.post('/', (request, response, next) => {
  const { content, important } = request.body;

  const note = new Note({
    content,
    important: important || false,
  });

  note
    .save()
    .then((savedNote) => {
      response.json(savedNote);
    })
    .catch((error) => next(error));
});

notesRouter.delete('/:id', (request, response, next) => {
  const id = request.params.id;

  Note.findByIdAndDelete(id)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

notesRouter.put('/:id', (request, response, next) => {
  const id = request.params.id;
  const { content, important } = request.body;

  const note = {
    content,
    important,
  };

  Note.findByIdAndUpdate(id, note, {
    new: true,
    runValidators: true,
    context: 'query',
  })
    .then((updatedNote) => {
      response.json(updatedNote);
    })
    .catch((error) => next(error));
});

module.exports = notesRouter;
