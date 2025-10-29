const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
    unique: true
  },
  personalInfo: {
    name: { type: String, required: true },
    dob: { type: Date, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    contact: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String },
    parentContact: { type: String }
  },
  academicInfo: {
    course: { type: String, required: true },
    year: { type: Number, required: true },
    rollNo: { type: String, required: true },
    enrollmentDate: { type: Date, default: Date.now },
    department: { type: String }
  },
  financialInfo: {
    feeStatus: { type: String, enum: ['Paid', 'Pending', 'Partial'], default: 'Pending' },
    totalFees: { type: Number, default: 0 },
    paidAmount: { type: Number, default: 0 },
    dues: { type: Number, default: 0 }
  },
  hostelInfo: {
    isHostelResident: { type: Boolean, default: false },
    roomNo: { type: String },
    blockName: { type: String },
    allocationDate: { type: Date }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Student', studentSchema);