// Local Files
const Note = require('../models/note');
const User = require('../models/user');

const initialNotes = [
  {
    content: 'HTML is easy',
    important: false,
  },
  {
    content: 'Browser can execute only JavaScript',
    important: true,
  },
];

async function nonExistingId() {
  const note = new Note({ content: 'will be removed this soon' });
  await note.save();
  await note.deleteOne();

  return note._id.toString();
}

async function notesInDb() {
  const notes = await Note.find({});
  return notes.map((note) => note.toJSON());
}

async function usersInDb() {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
}

module.exports = {
  initialNotes,
  nonExistingId,
  notesInDb,
  usersInDb,
};
