const mongoose = require('mongoose');

const admissionSchema = new mongoose.Schema({
  applicationId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  studentName: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true 
  },
  phone: { 
    type: String, 
    required: true 
  },
  course: { 
    type: String, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Rejected', 'Under Review'],
    default: 'Pending'
  },
  documents: [{
    name: String,
    url: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
  meritScore: { type: Number },
  applicationDate: { type: Date, default: Date.now },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reviewDate: Date,
  notes: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Admission', admissionSchema);