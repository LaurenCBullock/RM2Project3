const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');

let NoteModel = {};

const convertId = mongoose.Types.ObjectId;
const setTitle = (title) => _.escape(title).trim();

const NoteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    set: setTitle,
  },
    
  desc: {
    type: String,
    required: true,
    trim: true,
  },

  dueDate: {
    type: Date,
    required: true,
  },

  diffLevel: {
    type: Number,
    min: 0,
    required: true,
  },

  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  createdData: {
    type: Date,
    default: Date.now,
  },
});

NoteSchema.statics.toAPI = (doc) => ({
  title: doc.title,
  desc: doc.description,
  dueDate: doc.dueDate,
});

NoteSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };
  return NoteModel.find(search).select('title desc dueDate diffLevel').exec(callback);
};

NoteSchema.statics.findByKey = (key, callback) => {
    const search = {
    _id: key,
  };
    console.log(NoteModel);
    return NoteModel.find(search).exec(callback)};

NoteModel = mongoose.model('Note', NoteSchema);

module.exports.NoteModel = NoteModel;
module.exports.NoteSchema = NoteSchema;
