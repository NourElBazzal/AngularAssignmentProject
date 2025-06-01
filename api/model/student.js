const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  image: { type: String },
  coursesTaken: [{ type: String }], // array of course names or IDs
  assignments: [{ type: String }]   // assignment IDs or objects, adjust as needed
}, { _id: true });

module.exports = mongoose.model('Student', studentSchema);
