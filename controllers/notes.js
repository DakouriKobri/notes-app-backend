// NPM Packages
const notesRouter = require('express').Router();

// Local Files
const Note = require('../models/note');
const User = require('../models/user');

notesRouter.get('/', async (request, response) => {
  const notes = await Note.find({}).populate('user', {
    username: 1,
    name: 1,
  });
  response.json(notes);
});

notesRouter.get('/:id', async (request, response) => {
  const id = request.params.id;

  const note = await Note.findById(id);
  if (note) {
    response.json(note);
  } else {
    response.status(404).end();
  }
});

notesRouter.post('/', async (request, response) => {
  const { content, important, userId } = request.body;

  const user = await User.findById(userId);

  const note = new Note({
    content,
    important: important ?? false,
    user: userId,
  });

  const savedNote = await note.save();
  user.notes = user.notes.concat(savedNote._id);
  await user.save();

  response.status(201).json(savedNote);
});

notesRouter.delete('/:id', async (request, response) => {
  const id = request.params.id;
  await Note.findByIdAndDelete(id);
  response.status(204).end();
});

notesRouter.put('/:id', async (request, response) => {
  const id = request.params.id;
  const { content, important } = request.body;

  const note = {
    content,
    important,
  };

  const updatedNote = await Note.findByIdAndUpdate(id, note, {
    new: true,
    runValidators: true,
    context: 'query',
  });
  response.json(updatedNote);
});

module.exports = notesRouter;
