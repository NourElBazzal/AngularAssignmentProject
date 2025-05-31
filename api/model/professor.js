const mongoose = require('mongoose');

const professorSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  image: { type: String },
  courseIds: [{ type: String }]  // array of course codes or IDs
}, { _id: true });

module.exports = mongoose.model('Professor', professorSchema);
