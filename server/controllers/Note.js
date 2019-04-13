const models = require('../models');
const Note = models.Note;


const makeNote = (req, res) => {
  if (!req.body.title || !req.body.desc ||
      !req.body.diffLevel || !req.body.dueDate
      || !req.body.dueTime) {
    return res.status(400).json({ error: 'RAWR! Title, description, and date are required' });
  }

  const noteData = {
    title: req.body.title,
    desc: req.body.desc,
    dueDate: req.body.dueDate,
    dueTime: req.body.dueTime,
    diffLevel: req.body.diffLevel,
    owner: req.session.account._id,
  };

  const newNote = new Note.NoteModel(noteData);

  const notePromise = newNote.save();

  notePromise.then(() => res.json({ redirect: '/maker' }));

  notePromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Note already exists' });
    }
    return res.status(400).json({ error: 'An error occurred' });
  });
  return notePromise;
};


const makerPage = (req, res) => {
  Note.NoteModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }
    return res.render('app', { csrfToken: req.csrfToken(), notes: docs });
  });
};
const getNotes = (request, response) => {
  const req = request;
  const res = response;

  return Note.NoteModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }
    return res.json({ notes: docs });
  });
};


const deleteNotes = (request) => {
  console.log(`Deleting: _id:${request.body._id}`);
    // Note.NoteModel.

  Note.NoteModel.deleteOne({ _id: request.body._id }, (err) => {
    console.dir(err);
  });
};
module.exports.makerPage = makerPage;
module.exports.getNotes = getNotes;
module.exports.deleteNotes = deleteNotes;
module.exports.make = makeNote;
