// NPM Packages
require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Local Files
const Note = require('./models/note');

const app = express();

let notes = [
  {
    id: 1,
    content: 'HTML is easy',
    important: true,
  },
  {
    id: 2,
    content: 'Browser can execute only JavaScript',
    important: false,
  },
  {
    id: 3,
    content: 'GET and POST are the most important methods of HTTP protocol',
    important: true,
  },
];

function generateId() {
  const maxId =
    notes.length > 0 ? Math.max(...notes.map((note) => note.id)) : 0;
  return maxId + 1;
}

function requestLogger(request, response, next) {
  console.log('Method:', request.method);
  console.log('Path:', request.path);
  console.log('Body:', request.body);
  next();
}

function unknownEndpoint(request, response) {
  response.status(404).send({ error: 'Unknown endpoint' });
}

app.use(express.json());
app.use(cors());
app.use(requestLogger);
app.use(express.static('dist'));

app.get('/', (request, response) => {
  response.send('<h1>Hello, World!</h1>');
});

app.get('/api/notes', (request, response) => {
  Note.find({}).then((notes) => {
    response.json(notes);
  });
});

app.get('/api/notes/:id', (request, response) => {
  const id = request.params.id;

  Note.findById(id).then((note) => {
    response.json(note);
  });
});

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id);
  const note = notes.find((note) => note.id === id);
  if (!note) return response.status(404).end();
  notes = notes.filter((note) => note.id !== id);
  response.status(204).end();
});

app.post('/api/notes', (request, response) => {
  const body = request.body;

  if (body.content === undefined) {
    return response.status(400).json({ error: 'Content missing' });
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
    id: generateId(),
  });

  note.save().then((savedNote) => {
    response.json(savedNote);
  });
});

app.use(unknownEndpoint);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
