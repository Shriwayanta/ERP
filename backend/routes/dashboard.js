const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Student = require('../models/Student');
const Fee = require('../models/Fee');
const Room = require('../models/Room');

router.get('/stats', protect, async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments({ isActive: true });
    
    const feeStats = await Fee.aggregate([
      {
        $group: {
          _id: null,
          totalCollected: { $sum: '$paidAmount' },
          totalDue: { $sum: '$dueAmount' }
        }
      }
    ]);

    const hostelStats = await Room.aggregate([
      {
        $group: {
          _id: null,
          totalCapacity: { $sum: '$capacity' },
          totalOccupancy: { $sum: '$currentOccupancy' }
        }
      }
    ]);

    const occupancyRate = hostelStats[0]
      ? ((hostelStats[0].totalOccupancy / hostelStats[0].totalCapacity) * 100).toFixed(1)
      : 0;

    res.json({
      success: true,
      data: {
        totalStudents,
        feeCollection: feeStats[0]?.totalCollected || 0,
        feeDue: feeStats[0]?.totalDue || 0,
        hostelOccupancy: parseFloat(occupancyRate),
        systemUptime: '99.8%'
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;