const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  courseId: { type: String, required: true }
});

module.exports = mongoose.model('Enrollment', enrollmentSchema);