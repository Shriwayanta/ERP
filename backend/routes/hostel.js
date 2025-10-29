const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const Student = require('../models/Student');
const { protect, authorize } = require('../middleware/auth');

router.get('/rooms', protect, async (req, res) => {
  try {
    const { status, blockName } = req.query;
    const query = {};
    if (status) query.status = status;
    if (blockName) query.blockName = blockName;

    const rooms = await Room.find(query)
      .populate('allocatedStudents', 'studentId personalInfo.name personalInfo.contact')
      .sort({ blockName: 1, floor: 1, roomNumber: 1 });

    res.json({ success: true, count: rooms.length, data: rooms });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/rooms', protect, authorize('Super Admin', 'Hostel Warden'), async (req, res) => {
  try {
    const room = await Room.create(req.body);
    res.status(201).json({ success: true, data: room });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.post('/rooms/:roomId/allocate', protect, authorize('Super Admin', 'Hostel Warden'), async (req, res) => {
  try {
    const { studentId } = req.body;
    const room = await Room.findById(req.params.roomId);
    
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    if (room.currentOccupancy >= room.capacity) {
      return res.status(400).json({ success: false, message: 'Room is fully occupied' });
    }

    room.allocatedStudents.push(studentId);
    room.currentOccupancy = room.allocatedStudents.length;
    
    if (room.currentOccupancy >= room.capacity) {
      room.status = 'Occupied';
    }

    await room.save();

    await Student.findByIdAndUpdate(studentId, {
      'hostelInfo.isHostelResident': true,
      'hostelInfo.roomNo': room.roomNumber,
      'hostelInfo.blockName': room.blockName,
      'hostelInfo.allocationDate': Date.now()
    });

    res.json({ success: true, message: 'Room allocated successfully', data: room });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.get('/stats', protect, async (req, res) => {
  try {
    const totalRooms = await Room.countDocuments();
    const occupiedRooms = await Room.countDocuments({ status: 'Occupied' });
    const availableRooms = await Room.countDocuments({ status: 'Available' });

    const capacityStats = await Room.aggregate([
      {
        $group: {
          _id: null,
          totalCapacity: { $sum: '$capacity' },
          totalOccupancy: { $sum: '$currentOccupancy' }
        }
      }
    ]);

    const occupancyRate = capacityStats[0] 
      ? ((capacityStats[0].totalOccupancy / capacityStats[0].totalCapacity) * 100).toFixed(2)
      : 0;

    res.json({
      success: true,
      data: {
        totalRooms,
        occupiedRooms,
        availableRooms,
        totalCapacity: capacityStats[0]?.totalCapacity || 0,
        totalOccupancy: capacityStats[0]?.totalOccupancy || 0,
        occupancyRate: parseFloat(occupancyRate)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;