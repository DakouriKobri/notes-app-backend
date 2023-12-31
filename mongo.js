// NPM Packages
const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('Give password as argument');
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://Dakouri:${password}@cluster0.racdybo.mongodb.net/noteApp?retryWrites=true&w=majority`;

mongoose.set('strictQuery', false);
mongoose.connect(url);

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
});

const Note = mongoose.model('Note', noteSchema);

/* const note = new Note({
  content: 'TypeScript is easy',
  important: false,
}); */

/* note.save().then((result) => {
  console.log('Note saved successfully:');
  mongoose.connection.close();
}); */

Note.find({ important: true }).then((result) => {
  result.forEach((note) => {
    console.log('note:', note);
  });
  mongoose.connection.close();
});
