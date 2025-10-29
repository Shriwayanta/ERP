const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomNumber: { type: String, required: true, unique: true },
  blockName: { type: String, required: true },
  floor: { type: Number, required: true },
  capacity: { type: Number, required: true, default: 2 },
  currentOccupancy: { type: Number, default: 0 },
  type: { type: String, enum: ['Single', 'Double', 'Triple', 'Quad'], default: 'Double' },
  facilities: [String],
  status: { type: String, enum: ['Available', 'Occupied', 'Maintenance'], default: 'Available' },
  rent: { type: Number, required: true },
  allocatedStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }]
});

module.exports = mongoose.model('Room', roomSchema);