const express = require('express');
const router = express.Router();
const { Book, Issue } = require('../models/Library');
const { protect, authorize } = require('../middleware/auth');

router.get('/books', protect, async (req, res) => {
  try {
    const { category, search } = req.query;
    const query = {};
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } }
      ];
    }

    const books = await Book.find(query).sort({ title: 1 });
    res.json({ success: true, count: books.length, data: books });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/books', protect, authorize('Super Admin'), async (req, res) => {
  try {
    const book = await Book.create({ ...req.body, availableCopies: req.body.totalCopies });
    res.status(201).json({ success: true, data: book });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.get('/issues', protect, async (req, res) => {
  try {
    const issues = await Issue.find()
      .populate('book', 'title author')
      .populate('student', 'studentId personalInfo.name')
      .sort({ issueDate: -1 });
    res.json({ success: true, count: issues.length, data: issues });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
