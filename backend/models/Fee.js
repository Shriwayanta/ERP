const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema({
  student: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Student', 
    required: true 
  },
  academicYear: { type: String, required: true },
  semester: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  paidAmount: { type: Number, default: 0 },
  dueAmount: { type: Number },
  status: {
    type: String,
    enum: ['Paid', 'Pending', 'Partial', 'Overdue'],
    default: 'Pending'
  },
  dueDate: { type: Date, required: true },
  transactions: [{
    transactionId: String,
    amount: Number,
    paymentMethod: String,
    paymentDate: { type: Date, default: Date.now },
    receiptUrl: String,
    status: { type: String, enum: ['Success', 'Failed', 'Pending'], default: 'Success' }
  }],
  lateFee: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

feeSchema.pre('save', function(next) {
  this.dueAmount = this.totalAmount - this.paidAmount + this.lateFee - this.discount;
  
  if (this.dueAmount <= 0) {
    this.status = 'Paid';
  } else if (this.paidAmount > 0) {
    this.status = 'Partial';
  } else if (new Date() > this.dueDate) {
    this.status = 'Overdue';
  }
  
  next();
});

module.exports = mongoose.model('Fee', feeSchema);

