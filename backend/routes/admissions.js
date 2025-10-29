const express = require('express');
const router = express.Router();
const Admission = require('../models/Admission');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  try {
    const { status } = req.query;
    const query = status ? { status } : {};
    const applications = await Admission.find(query)
      .populate('reviewedBy', 'name email')
      .sort({ applicationDate: -1 });
    res.json({ success: true, count: applications.length, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const applicationId = 'APP' + Date.now();
    const application = await Admission.create({ ...req.body, applicationId });
    res.status(201).json({ success: true, data: application });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.put('/:id/status', protect, authorize('Super Admin', 'Department Head'), async (req, res) => {
  try {
    const { status, notes } = req.body;
    const application = await Admission.findByIdAndUpdate(
      req.params.id,
      { status, notes, reviewedBy: req.user._id, reviewDate: Date.now() },
      { new: true }
    );
    res.json({ success: true, data: application });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.get('/stats', protect, async (req, res) => {
  try {
    const stats = await Admission.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    const total = await Admission.countDocuments();
    res.json({ success: true, data: { total, byStatus: stats } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
