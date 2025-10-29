const express = require('express');
const router = express.Router();
const Fee = require('../models/Fee');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  try {
    const { status, academicYear } = req.query;
    const query = {};
    if (status) query.status = status;
    if (academicYear) query.academicYear = academicYear;

    const fees = await Fee.find(query)
      .populate('student', 'studentId personalInfo.name academicInfo.course')
      .sort({ createdAt: -1 });
    
    res.json({ success: true, count: fees.length, data: fees });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/', protect, authorize('Super Admin', 'Accountant'), async (req, res) => {
  try {
    const fee = await Fee.create(req.body);
    res.status(201).json({ success: true, data: fee });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.post('/:id/payment', protect, authorize('Super Admin', 'Accountant'), async (req, res) => {
  try {
    const { amount, paymentMethod } = req.body;
    const fee = await Fee.findById(req.params.id);
    
    if (!fee) {
      return res.status(404).json({ success: false, message: 'Fee record not found' });
    }

    const transactionId = 'TXN' + Date.now();
    fee.transactions.push({ transactionId, amount, paymentMethod, status: 'Success' });
    fee.paidAmount += amount;
    await fee.save();

    res.json({ success: true, message: 'Payment recorded successfully', data: fee, transactionId });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.get('/stats', protect, async (req, res) => {
  try {
    const overall = await Fee.aggregate([
      {
        $group: {
          _id: null,
          totalFees: { $sum: '$totalAmount' },
          totalPaid: { $sum: '$paidAmount' },
          totalDue: { $sum: '$dueAmount' }
        }
      }
    ]);

    res.json({ 
      success: true, 
      data: overall[0] || { totalFees: 0, totalPaid: 0, totalDue: 0 }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
