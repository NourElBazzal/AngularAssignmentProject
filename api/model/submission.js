const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  assignmentId: { type: Number, required: true },
  submitted: { type: Boolean, default: false },
  fileUrl: { type: String },
  submittedAt: { type: Date }
});

module.exports = mongoose.model('Submission', submissionSchema);