const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  dueDate: { type: Date, required: true },
  courseId: { type: String },
  submitted: { type: Boolean, default: false },
  fileUrl: { type: String },
  grade: { type: Number },
  feedback: { type: String }
}, { _id: true }); // Ensure MongoDB handles _id

module.exports = mongoose.model('Assignment', assignmentSchema);