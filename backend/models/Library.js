const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  isbn: { type: String, unique: true, sparse: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  publisher: String,
  category: { type: String, required: true },
  publicationYear: Number,
  totalCopies: { type: Number, required: true, default: 1 },
  availableCopies: { type: Number, required: true },
  location: {
    shelf: String,
    section: String
  },
  price: Number,
  status: {
    type: String,
    enum: ['Available', 'Issued', 'Lost', 'Damaged'],
    default: 'Available'
  }
}, {
  timestamps: true
});

const issueSchema = new mongoose.Schema({
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  issueDate: { type: Date, default: Date.now },
  dueDate: { type: Date, required: true },
  returnDate: Date,
  status: {
    type: String,
    enum: ['Issued', 'Returned', 'Overdue', 'Lost'],
    default: 'Issued'
  },
  fine: { type: Number, default: 0 }
}, {
  timestamps: true
});

const Book = mongoose.model('Book', bookSchema);
const Issue = mongoose.model('Issue', issueSchema);

module.exports = { Book, Issue };