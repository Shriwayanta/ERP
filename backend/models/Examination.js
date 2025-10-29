const mongoose = require('mongoose');

const examinationSchema = new mongoose.Schema({
  examName: { type: String, required: true },
  examType: {
    type: String,
    enum: ['Mid-Term', 'Final', 'Quiz', 'Practical', 'Assignment'],
    required: true
  },
  course: { type: String, required: true },
  semester: { type: Number, required: true },
  academicYear: { type: String, required: true },
  examDate: { type: Date, required: true },
  duration: { type: Number, required: true },
  totalMarks: { type: Number, required: true },
  passingMarks: { type: Number, required: true },
  results: [{
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    marksObtained: Number,
    grade: String,
    status: {
      type: String,
      enum: ['Pass', 'Fail', 'Absent', 'Pending']
    }
  }],
  status: {
    type: String,
    enum: ['Scheduled', 'Ongoing', 'Completed', 'Cancelled'],
    default: 'Scheduled'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Examination', examinationSchema);