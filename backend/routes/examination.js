const express = require('express');
const router = express.Router();
const Examination = require('../models/Examination');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  try {
    const { status, course, academicYear } = req.query;
    const query = {};
    if (status) query.status = status;
    if (course) query.course = course;
    if (academicYear) query.academicYear = academicYear;

    const exams = await Examination.find(query).sort({ examDate: -1 });
    res.json({ success: true, count: exams.length, data: exams });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/', protect, authorize('Super Admin', 'Department Head', 'Faculty'), async (req, res) => {
  try {
    const exam = await Examination.create(req.body);
    res.status(201).json({ success: true, data: exam });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;